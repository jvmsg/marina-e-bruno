"use client";

import { weddingContent } from "@/lib/content";
import { formatCurrency } from "@/lib/utils";
import { WeddingButton } from "@/components/wedding/wedding-button";

interface GiftCartBarProps {
  itemCount: number;
  totalCents: number;
  onOpenCart: () => void;
}

export function GiftCartBar({
  itemCount,
  totalCents,
  onOpenCart,
}: GiftCartBarProps) {
  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </p>
          <p className="font-serif text-lg text-foreground">
            {formatCurrency(totalCents)}
          </p>
        </div>
        <WeddingButton type="button" variant="accent" onClick={onOpenCart}>
          {weddingContent.messages.cartBarCta}
        </WeddingButton>
      </div>
    </div>
  );
}
