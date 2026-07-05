"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clearGiftCart } from "@/lib/gift-cart";
import { weddingContent } from "@/lib/content";
import { GiftStatusPage } from "@/components/gifts/gift-status-page";

export function GiftSuccessClient() {
  const searchParams = useSearchParams();
  const isPix = searchParams.get("method") === "pix";

  useEffect(() => {
    clearGiftCart();
  }, []);

  return (
    <GiftStatusPage
      eyebrow="Obrigado"
      title={isPix ? "Pix enviado" : "Presente confirmado"}
      description={
        isPix
          ? weddingContent.messages.pixSuccessDescription
          : `Recebemos seu presente com muito carinho. Mal podemos esperar para celebrar com você, ${weddingContent.couple.fullNames}.`
      }
      actions={[
        {
          href: "/",
          label: "Voltar ao convite",
        },
      ]}
    />
  );
}
