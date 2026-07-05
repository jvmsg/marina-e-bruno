"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { weddingContent } from "@/lib/content";
import { loadRsvpSession } from "@/lib/rsvp-session";
import type { GiftCartLine, GiftItem, PaymentMethod } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { WeddingButton } from "@/components/wedding/wedding-button";

interface GiftCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: GiftCartLine[];
  catalog: GiftItem[];
  totalCents: number;
  onAdd: (giftItemId: string) => void;
  onRemove: (giftItemId: string) => void;
}

export function GiftCartSheet({
  open,
  onOpenChange,
  lines,
  catalog,
  totalCents,
  onAdd,
  onRemove,
}: GiftCartSheetProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalogById = new Map(catalog.map((item) => [item.id, item]));

  const cartLines = lines
    .map((line) => {
      const item = catalogById.get(line.giftItemId);
      if (!item) {
        return null;
      }

      return {
        line,
        item,
        subtotalCents: item.price_cents * line.quantity,
      };
    })
    .filter((entry) => entry !== null);

  async function handleCheckout() {
    if (cartLines.length === 0) {
      return;
    }

    setLoading(true);
    setError(null);

    const session = loadRsvpSession();
    const payload = {
      items: lines.map((line) => ({
        giftItemId: line.giftItemId,
        quantity: line.quantity,
      })),
      familyId: session?.familyId,
      guestId: session?.guestId,
    };

    try {
      if (paymentMethod === "card") {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !data.url) {
          setError(data.error ?? weddingContent.messages.cartCheckoutError);
          return;
        }

        window.location.href = data.url;
        return;
      }

      const response = await fetch("/api/gifts/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        orderId?: string;
        pixCode?: string;
        amountCents?: number;
        error?: string;
      };

      if (!response.ok || !data.orderId || !data.pixCode) {
        setError(data.error ?? weddingContent.messages.cartCheckoutError);
        return;
      }

      onOpenChange(false);
      router.push(`/gifts/pix?order=${data.orderId}`);
    } catch {
      setError(weddingContent.messages.cartCheckoutError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="top-auto right-0 bottom-0 left-0 max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-[28px] border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-h-[90vh] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:p-6"
      >
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-2xl text-foreground">
            {weddingContent.messages.cartSheetTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Revise os presentes selecionados e escolha a forma de pagamento.
          </DialogDescription>
        </DialogHeader>

        {cartLines.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {weddingContent.messages.cartEmpty}
          </p>
        ) : (
          <div className="space-y-4">
            {cartLines.map(({ line, item, subtotalCents }) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-muted p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price_cents)} cada
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-medium text-accent">
                    {formatCurrency(subtotalCents)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remover um ${item.name}`}
                    >
                      −
                    </Button>
                    <span className="min-w-6 text-center font-medium">
                      {line.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="default"
                      size="icon"
                      className="size-9 rounded-full"
                      onClick={() => onAdd(item.id)}
                      aria-label={`Adicionar um ${item.name}`}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">
                Forma de pagamento
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                    paymentMethod === "card"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  <Label className="pointer-events-none">
                    {weddingContent.messages.cartPaymentCard}
                  </Label>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                    paymentMethod === "pix"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  <Label className="pointer-events-none">
                    {weddingContent.messages.cartPaymentPix}
                  </Label>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
              <span className="font-medium text-foreground">
                {weddingContent.messages.cartTotal}
              </span>
              <span className="font-serif text-xl text-foreground">
                {formatCurrency(totalCents)}
              </span>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <WeddingButton
              type="button"
              variant="accent"
              className="w-full"
              disabled={loading}
              onClick={handleCheckout}
            >
              {loading
                ? weddingContent.messages.cartPaying
                : paymentMethod === "pix"
                  ? weddingContent.messages.cartPixCta
                  : weddingContent.messages.cartPay}
            </WeddingButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
