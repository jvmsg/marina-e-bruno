import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createGiftOrder, resolveGiftCart } from "@/lib/gift-checkout";
import { createCheckoutLink } from "@/lib/infinitepay";

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
      totalCents,
      lineItems,
    });

    const url = await createCheckoutLink({
      orderNsu: order.id,
      items: lineItems.map((line) => ({
        quantity: line.quantity,
        price: line.giftItem.price_cents,
        description: line.giftItem.name,
      })),
    });

    return NextResponse.json({ url, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    const status =
      message.includes("não encontrado") || message.includes("Selecione")
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
