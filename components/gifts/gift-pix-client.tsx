"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { weddingContent } from "@/lib/content";
import { clearGiftCart } from "@/lib/gift-cart";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { WeddingButton } from "@/components/wedding/wedding-button";

export function GiftPixClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "";

  const [pixCode, setPixCode] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState<string | null>(
    orderId ? null : weddingContent.messages.pixInvalidLink,
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let cancelled = false;

    async function loadPixOrder() {
      try {
        const response = await fetch(`/api/gifts/pix?orderId=${orderId}`);
        const data = (await response.json()) as {
          pixCode?: string;
          amountCents?: number;
          error?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok || !data.pixCode || !data.amountCents) {
          setError(data.error ?? weddingContent.messages.pixInvalidLink);
          return;
        }

        setPixCode(data.pixCode);
        setAmountCents(data.amountCents);
      } catch {
        if (!cancelled) {
          setError(weddingContent.messages.pixInvalidLink);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPixOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const amountLabel = useMemo(() => {
    if (!amountCents) {
      return null;
    }

    return formatCurrency(amountCents);
  }, [amountCents]);

  async function handleCopy() {
    if (!pixCode) {
      return;
    }

    setCopyError(null);

    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(weddingContent.messages.pixCopyError);
    }
  }

  function handleConfirmPayment() {
    clearGiftCart();
    router.push("/gifts/success?method=pix");
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
        <p className="text-muted-foreground">{weddingContent.messages.cartPaying}</p>
      </main>
    );
  }

  if (!orderId || error || !pixCode || !amountLabel) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
        <Card className="w-full max-w-md rounded-[28px] py-8 text-center">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error ?? weddingContent.messages.pixInvalidLink}
            </p>
            <WeddingButton render={<Link href="/gifts" />}>
              Voltar aos presentes
            </WeddingButton>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-10">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <Link
          href="/gifts"
          className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Voltar aos presentes
        </Link>

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">
            {weddingContent.messages.pixEyebrow}
          </p>
          <h1 className="font-serif text-3xl text-foreground">
            {weddingContent.messages.pixTitle}
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            {weddingContent.messages.pixDescription}
          </p>
        </div>

        <Card className="rounded-[28px] py-6">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
              <span className="font-medium text-foreground">
                {weddingContent.messages.cartTotal}
              </span>
              <span className="font-serif text-2xl text-foreground">
                {amountLabel}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {weddingContent.messages.pixCodeLabel}
              </p>
              <div className="max-h-40 overflow-y-auto rounded-2xl border border-border bg-muted p-4">
                <p className="break-all font-mono text-xs leading-relaxed text-foreground">
                  {pixCode}
                </p>
              </div>
            </div>

            {copyError && (
              <Alert variant="destructive">
                <AlertDescription>{copyError}</AlertDescription>
              </Alert>
            )}

            {copied && (
              <Alert>
                <AlertDescription>
                  {weddingContent.messages.pixCopied}
                </AlertDescription>
              </Alert>
            )}

            <WeddingButton
              type="button"
              variant="accent"
              className="w-full"
              onClick={handleCopy}
            >
              {copied
                ? weddingContent.messages.pixCopied
                : weddingContent.messages.pixCopyCta}
            </WeddingButton>

            <WeddingButton
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleConfirmPayment}
            >
              {weddingContent.messages.pixConfirmCta}
            </WeddingButton>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
