"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clearGiftCart } from "@/lib/gift-cart";
import { weddingContent } from "@/lib/content";
import { GiftStatusPage } from "@/components/gifts/gift-status-page";

export function GiftSuccessClient() {
  const searchParams = useSearchParams();
  const [receiptUrl, setReceiptUrl] = useState<string | null>(
    searchParams.get("receipt_url"),
  );
  const [verifying, setVerifying] = useState(true);

  const orderNsu = searchParams.get("order_nsu");
  const transactionNsu = searchParams.get("transaction_nsu");
  const slug = searchParams.get("slug");
  const captureMethod = searchParams.get("capture_method");

  useEffect(() => {
    clearGiftCart();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function verifyPayment() {
      if (!orderNsu || !transactionNsu || !slug) {
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch("/api/infinitepay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNsu,
            transactionNsu,
            slug,
            captureMethod,
            receiptUrl: searchParams.get("receipt_url"),
          }),
        });

        const data = (await response.json()) as {
          paid?: boolean;
          receiptUrl?: string | null;
        };

        if (!cancelled && data.receiptUrl) {
          setReceiptUrl(data.receiptUrl);
        }
      } catch {
        // Webhook may still confirm the order; keep success UX.
      } finally {
        if (!cancelled) {
          setVerifying(false);
        }
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [orderNsu, transactionNsu, slug, captureMethod, searchParams]);

  const actions = [
    {
      href: "/",
      label: "Voltar ao convite",
    },
    ...(receiptUrl
      ? [
          {
            href: receiptUrl,
            label: "Ver comprovante",
            variant: "outline" as const,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <GiftStatusPage
      eyebrow="Obrigado"
      title={verifying ? "Confirmando presente..." : "Presente confirmado"}
      description={weddingContent.messages.giftSuccessDescription}
      actions={actions}
    />
  );
}
