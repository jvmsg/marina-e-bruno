"use client";

import { weddingContent } from "@/lib/content";
import { FadeUp } from "@/components/motion/fade-up";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function GiftsIntro() {
  return (
    <FadeUp>
      <Card className="rounded-[28px] py-6 shadow-[0_18px_50px_rgba(0,56,23,0.08)]">
        <CardContent>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">
            Com carinho
          </p>
          <h1 className="mt-2 font-serif text-4xl text-foreground">
            {weddingContent.messages.giftsTitle}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {weddingContent.messages.giftsSubtitle}
          </p>
        </CardContent>
      </Card>
    </FadeUp>
  );
}
