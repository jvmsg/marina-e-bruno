"use client";

import Link from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { WeddingButton } from "@/components/wedding/wedding-button";

interface GiftStatusAction {
  href: string;
  label: string;
  variant?: "default" | "outline" | "accent";
}

interface GiftStatusPageProps {
  eyebrow: string;
  title: string;
  description: string;
  actions: GiftStatusAction[];
}

export function GiftStatusPage({
  eyebrow,
  title,
  description,
  actions,
}: GiftStatusPageProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <FadeUp className="w-full max-w-md">
        <Card className="rounded-[28px] py-8 text-center shadow-[0_18px_50px_rgba(0,56,23,0.08)]">
          <CardContent className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-accent">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(1.65rem,7vw,1.875rem)] text-foreground">{title}</h1>
            <p className="leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="flex flex-col gap-3 pt-4">
              {actions.map((action) => (
                <WeddingButton
                  key={action.href + action.label}
                  variant={action.variant ?? "default"}
                  render={<Link href={action.href} />}
                >
                  {action.label}
                </WeddingButton>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </main>
  );
}
