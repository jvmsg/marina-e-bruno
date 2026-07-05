import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createGiftOrder, resolveGiftCart } from "@/lib/gift-checkout";
import { createPixCopyPasteCode } from "@/lib/pix";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId")?.trim();

    if (!orderId) {
      return NextResponse.json({ error: "Pedido não informado." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: order, error } = await supabase
      .from("gift_orders")
      .select("id, amount_cents, payment_method, status")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }

    if (order.payment_method !== "pix") {
      return NextResponse.json({ error: "Este pedido não é Pix." }, { status: 400 });
    }

    const pixCode = createPixCopyPasteCode(order.id, order.amount_cents);

    return NextResponse.json({
      orderId: order.id,
      pixCode,
      amountCents: order.amount_cents,
      status: order.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: { giftItemId?: string; quantity?: number }[];
      familyId?: string;
      guestId?: string;
    };

    const supabase = createServiceClient();
    const { lineItems, totalCents } = await resolveGiftCart(
      supabase,
      body.items ?? [],
    );

    const order = await createGiftOrder(supabase, {
      familyId: body.familyId,
      guestId: body.guestId,
      paymentMethod: "pix",
      totalCents,
      sessionReference: `pix-pending-${crypto.randomUUID()}`,
      lineItems,
    });

    await supabase
      .from("gift_orders")
      .update({ stripe_checkout_session_id: `pix-${order.id}` })
      .eq("id", order.id);

    const pixCode = createPixCopyPasteCode(order.id, totalCents);

    return NextResponse.json({
      orderId: order.id,
      pixCode,
      amountCents: totalCents,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    const status = message.includes("não encontrado") || message.includes("Selecione")
      ? 400
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
