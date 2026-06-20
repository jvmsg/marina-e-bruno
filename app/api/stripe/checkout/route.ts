import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type { GiftItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      giftItemId?: string;
      familyId?: string;
      guestId?: string;
    };

    const giftItemId = body.giftItemId?.trim();

    if (!giftItemId) {
      return NextResponse.json({ error: "Selecione um presente." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const supabase = createServiceClient();

    const { data: giftItem, error: giftError } = await supabase
      .from("gift_items")
      .select("*")
      .eq("id", giftItemId)
      .eq("active", true)
      .single();

    if (giftError || !giftItem) {
      return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
    }

    const item = giftItem as GiftItem;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: item.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/gifts/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gifts/cancel`,
      metadata: {
        gift_item_id: item.id,
        family_id: body.familyId ?? "",
        guest_id: body.guestId ?? "",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Não foi possível iniciar o pagamento." }, { status: 500 });
    }

    const { error: orderError } = await supabase.from("gift_orders").insert({
      family_id: body.familyId || null,
      guest_id: body.guestId || null,
      gift_item_id: item.id,
      stripe_checkout_session_id: session.id,
      amount_cents: item.price_cents,
      status: "pending",
    });

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
