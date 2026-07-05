import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type { GiftOrderStatus } from "@/lib/types";

async function updateOrderBySessionId(
  sessionId: string,
  status: GiftOrderStatus,
) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gift_orders")
    .update({ status })
    .eq("stripe_checkout_session_id", sessionId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Assinatura inválida.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        await updateOrderBySessionId(session.id, "paid");
      }
    }

    if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateOrderBySessionId(session.id, "paid");
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateOrderBySessionId(session.id, "failed");
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateOrderBySessionId(session.id, "failed");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
