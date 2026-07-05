import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { createGiftOrder, resolveGiftCart } from "@/lib/gift-checkout";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: { giftItemId?: string; quantity?: number }[];
      familyId?: string;
      guestId?: string;
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const supabase = createServiceClient();
    const { lineItems, totalCents } = await resolveGiftCart(
      supabase,
      body.items ?? [],
    );

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "brl",
      line_items: lineItems.map((line) => ({
        price: line.giftItem.stripe_price_id,
        quantity: line.quantity,
      })),
      payment_method_types: ["card"],
      success_url: `${siteUrl}/gifts/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gifts/cancel`,
      metadata: {
        family_id: body.familyId ?? "",
        guest_id: body.guestId ?? "",
        payment_method: "card",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Não foi possível iniciar o pagamento." },
        { status: 500 },
      );
    }

    await createGiftOrder(supabase, {
      familyId: body.familyId,
      guestId: body.guestId,
      paymentMethod: "card",
      totalCents,
      sessionReference: session.id,
      lineItems,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    const status = message.includes("não encontrado") || message.includes("Selecione")
      ? 400
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
