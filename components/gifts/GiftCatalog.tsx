"use client";

import { useState } from "react";
import { useGiftCart } from "@/hooks/use-gift-cart";
import type { GiftItem } from "@/lib/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { GiftCard } from "@/components/gifts/gift-card";
import { GiftCartBar } from "@/components/gifts/gift-cart-bar";
import { GiftCartSheet } from "@/components/gifts/gift-cart-sheet";

interface GiftCatalogProps {
  items: GiftItem[];
}

export function GiftCatalog({ items }: GiftCatalogProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const {
    lines,
    itemCount,
    totalCents,
    hasItems,
    getQuantity,
    addItem,
    removeItem,
  } = useGiftCart(items);

  if (items.length === 0) {
    return (
      <Card className="rounded-2xl py-6 text-center">
        <CardContent>
          <p className="text-muted-foreground">
            Em breve disponibilizaremos os presentes aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className={hasItems ? "space-y-4 pb-28" : "space-y-4"}>
        {items.map((item) => (
          <GiftCard
            key={item.id}
            item={item}
            quantity={getQuantity(item.id)}
            onAdd={() => addItem(item.id)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      <GiftCartBar
        itemCount={itemCount}
        totalCents={totalCents}
        onOpenCart={() => setCartOpen(true)}
      />

      <GiftCartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        lines={lines}
        catalog={items}
        totalCents={totalCents}
        onAdd={addItem}
        onRemove={removeItem}
      />
    </>
  );
}
