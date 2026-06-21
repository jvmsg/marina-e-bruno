"use client";

import { useState } from "react";
import { loadRsvpSession } from "@/lib/rsvp-session";
import type { GiftItem } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { GiftCard } from "@/components/gifts/gift-card";

interface GiftCatalogProps {
  items: GiftItem[];
}

export function GiftCatalog({ items }: GiftCatalogProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(item: GiftItem) {
    setLoadingId(item.id);
    setError(null);

    const session = loadRsvpSession();

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftItemId: item.id,
          familyId: session?.familyId,
          guestId: session?.guestId,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? "Não foi possível iniciar o pagamento.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setLoadingId(null);
    }
  }

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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {items.map((item) => (
        <GiftCard
          key={item.id}
          item={item}
          loading={loadingId === item.id}
          onCheckout={handleCheckout}
        />
      ))}
    </div>
  );
}
