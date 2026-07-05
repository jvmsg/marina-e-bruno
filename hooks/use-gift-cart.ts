"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  addCartItem,
  clearGiftCart,
  getCartItemCount,
  getCartQuantity,
  getCartTotalCents,
  loadGiftCart,
  removeCartItem,
  saveGiftCart,
  setCartQuantity,
  subscribeGiftCart,
} from "@/lib/gift-cart";
import type { GiftItem } from "@/lib/types";

export function useGiftCart(catalog: GiftItem[]) {
  const lines = useSyncExternalStore(
    subscribeGiftCart,
    loadGiftCart,
    () => [],
  );

  const itemCount = useMemo(() => getCartItemCount(lines), [lines]);
  const totalCents = useMemo(
    () => getCartTotalCents(lines, catalog),
    [catalog, lines],
  );

  const getQuantity = useCallback(
    (giftItemId: string) => getCartQuantity(lines, giftItemId),
    [lines],
  );

  const addItem = useCallback(
    (giftItemId: string) => {
      saveGiftCart(addCartItem(loadGiftCart(), giftItemId));
    },
    [],
  );

  const removeItem = useCallback(
    (giftItemId: string) => {
      saveGiftCart(removeCartItem(loadGiftCart(), giftItemId));
    },
    [],
  );

  const updateQuantity = useCallback((giftItemId: string, quantity: number) => {
    saveGiftCart(setCartQuantity(loadGiftCart(), giftItemId, quantity));
  }, []);

  const clearCart = useCallback(() => {
    clearGiftCart();
  }, []);

  return {
    lines,
    itemCount,
    totalCents,
    hasItems: itemCount > 0,
    getQuantity,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
