"use client";

import { useState } from "react";
import { loadRsvpSession } from "@/lib/rsvp-session";
import type { GiftItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StorageImage } from "@/components/ui/StorageImage";

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
      <div className="rounded-2xl border border-[color:var(--bg-taupe)] bg-[color:var(--bg-sand)] p-6 text-center text-[color:var(--accent-men)]/80">
        Em breve disponibilizaremos os presentes aqui.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-2xl bg-[color:var(--accent-women)]/10 px-4 py-3 text-sm text-[color:var(--accent-women)]">
          {error}
        </p>
      )}

      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-[24px] border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] shadow-sm"
        >
          {item.image_path && (
            <div className="relative h-44 w-full">
              <StorageImage path={item.image_path} alt={item.name} fill />
            </div>
          )}

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[color:var(--accent-men)]">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--accent-men)]/75">
                  {item.description}
                </p>
              </div>
              <p className="whitespace-nowrap font-medium text-[color:var(--accent-women)]">
                {formatCurrency(item.price_cents)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCheckout(item)}
              disabled={loadingId === item.id}
              className="mt-5 w-full rounded-full bg-[color:var(--accent-men)] px-4 py-3 text-sm font-medium text-[color:var(--bg-cream)] disabled:opacity-50"
            >
              {loadingId === item.id ? "Redirecionando..." : "Presentear"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
