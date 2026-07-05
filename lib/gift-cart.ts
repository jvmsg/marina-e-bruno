import type { GiftCartLine, GiftItem } from "@/lib/types";

export const GIFT_CART_STORAGE_KEY = "wedding-gift-cart";
export const MAX_GIFT_QUANTITY = 99;

let cartSnapshot: GiftCartLine[] = [];
let cartSnapshotSerialized = "";

export function clampGiftQuantity(quantity: number): number {
  return Math.min(MAX_GIFT_QUANTITY, Math.max(0, Math.floor(quantity)));
}

function normalizeCartLines(parsed: unknown): GiftCartLine[] {
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      (line) =>
        line &&
        typeof line === "object" &&
        "giftItemId" in line &&
        "quantity" in line &&
        typeof line.giftItemId === "string" &&
        typeof line.quantity === "number" &&
        line.quantity > 0,
    )
    .map((line) => ({
      giftItemId: line.giftItemId,
      quantity: clampGiftQuantity(line.quantity),
    }))
    .filter((line) => line.quantity > 0);
}

function serializeCart(lines: GiftCartLine[]): string {
  return JSON.stringify(lines);
}

function setCartSnapshot(lines: GiftCartLine[]): GiftCartLine[] {
  cartSnapshot = lines;
  cartSnapshotSerialized = serializeCart(lines);
  return cartSnapshot;
}

function parseStoredCart(raw: string | null): GiftCartLine[] {
  if (!raw) {
    return [];
  }

  try {
    return normalizeCartLines(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function loadGiftCart(): GiftCartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(GIFT_CART_STORAGE_KEY) ?? "[]";

  if (raw === cartSnapshotSerialized) {
    return cartSnapshot;
  }

  return setCartSnapshot(parseStoredCart(raw));
}

export function saveGiftCart(lines: GiftCartLine[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeCartLines(lines);
  const serialized = serializeCart(normalized);

  setCartSnapshot(normalized);
  window.localStorage.setItem(GIFT_CART_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(GIFT_CART_STORAGE_KEY));
}

export function subscribeGiftCart(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === GIFT_CART_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(GIFT_CART_STORAGE_KEY, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(GIFT_CART_STORAGE_KEY, onStoreChange);
  };
}

export function clearGiftCart(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GIFT_CART_STORAGE_KEY);
  setCartSnapshot([]);
  window.dispatchEvent(new Event(GIFT_CART_STORAGE_KEY));
}

export function getCartItemCount(lines: GiftCartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function getCartTotalCents(
  lines: GiftCartLine[],
  catalog: GiftItem[],
): number {
  const priceById = new Map(catalog.map((item) => [item.id, item.price_cents]));

  return lines.reduce((total, line) => {
    const unitPrice = priceById.get(line.giftItemId);
    return unitPrice ? total + unitPrice * line.quantity : total;
  }, 0);
}

export function getCartQuantity(
  lines: GiftCartLine[],
  giftItemId: string,
): number {
  return lines.find((line) => line.giftItemId === giftItemId)?.quantity ?? 0;
}

export function setCartQuantity(
  lines: GiftCartLine[],
  giftItemId: string,
  quantity: number,
): GiftCartLine[] {
  const nextQuantity = clampGiftQuantity(quantity);

  if (nextQuantity === 0) {
    return lines.filter((line) => line.giftItemId !== giftItemId);
  }

  const existing = lines.some((line) => line.giftItemId === giftItemId);

  if (!existing) {
    return [...lines, { giftItemId, quantity: nextQuantity }];
  }

  return lines.map((line) =>
    line.giftItemId === giftItemId
      ? { ...line, quantity: nextQuantity }
      : line,
  );
}

export function addCartItem(
  lines: GiftCartLine[],
  giftItemId: string,
): GiftCartLine[] {
  const current = getCartQuantity(lines, giftItemId);
  return setCartQuantity(lines, giftItemId, current + 1);
}

export function removeCartItem(
  lines: GiftCartLine[],
  giftItemId: string,
): GiftCartLine[] {
  const current = getCartQuantity(lines, giftItemId);
  return setCartQuantity(lines, giftItemId, current - 1);
}
