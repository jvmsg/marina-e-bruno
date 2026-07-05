import type { SupabaseClient } from "@supabase/supabase-js";
import type { GiftItem } from "@/lib/types";

export interface CheckoutItemInput {
  giftItemId: string;
  quantity: number;
}

export interface ResolvedCartLine {
  giftItem: GiftItem;
  quantity: number;
}

export function normalizeCheckoutItems(
  rawItems: { giftItemId?: string; quantity?: number }[],
): CheckoutItemInput[] {
  return rawItems
    .map((item) => ({
      giftItemId: item.giftItemId?.trim() ?? "",
      quantity: Math.floor(item.quantity ?? 0),
    }))
    .filter((item) => item.giftItemId && item.quantity > 0);
}

export async function resolveGiftCart(
  supabase: SupabaseClient,
  rawItems: { giftItemId?: string; quantity?: number }[],
): Promise<{ lineItems: ResolvedCartLine[]; totalCents: number }> {
  const normalizedItems = normalizeCheckoutItems(rawItems);

  if (normalizedItems.length === 0) {
    throw new Error("Selecione ao menos um presente.");
  }

  const giftItemIds = [...new Set(normalizedItems.map((item) => item.giftItemId))];

  const { data: giftItems, error: giftError } = await supabase
    .from("gift_items")
    .select("*")
    .in("id", giftItemIds)
    .eq("active", true);

  if (giftError || !giftItems || giftItems.length !== giftItemIds.length) {
    throw new Error("Presente não encontrado.");
  }

  const catalog = giftItems as GiftItem[];
  const catalogById = new Map(catalog.map((item) => [item.id, item]));

  const lineItems = normalizedItems.map((item) => {
    const giftItem = catalogById.get(item.giftItemId);

    if (!giftItem) {
      throw new Error("Presente não encontrado.");
    }

    return {
      giftItem,
      quantity: item.quantity,
    };
  });

  const totalCents = lineItems.reduce(
    (total, line) => total + line.giftItem.price_cents * line.quantity,
    0,
  );

  if (totalCents <= 0) {
    throw new Error("Total inválido.");
  }

  return { lineItems, totalCents };
}

export async function createGiftOrder(
  supabase: SupabaseClient,
  options: {
    familyId?: string;
    guestId?: string;
    paymentMethod: "card" | "pix";
    totalCents: number;
    sessionReference: string;
    lineItems: ResolvedCartLine[];
  },
) {
  const { data: order, error: orderError } = await supabase
    .from("gift_orders")
    .insert({
      family_id: options.familyId || null,
      guest_id: options.guestId || null,
      stripe_checkout_session_id: options.sessionReference,
      amount_cents: options.totalCents,
      payment_method: options.paymentMethod,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Erro ao salvar pedido.");
  }

  const orderItems = options.lineItems.map((line) => ({
    gift_order_id: order.id,
    gift_item_id: line.giftItem.id,
    quantity: line.quantity,
    unit_price_cents: line.giftItem.price_cents,
  }));

  const { error: orderItemsError } = await supabase
    .from("gift_order_items")
    .insert(orderItems);

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  return order;
}
