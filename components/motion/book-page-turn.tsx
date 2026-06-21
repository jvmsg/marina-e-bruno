"use client";

import { motion } from "motion/react";
import type { FlipDirection } from "@/hooks/use-book-navigation";
import { springPage, springPageBack } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface BookPageTurnProps {
  step: number;
  isAnimating: boolean;
  direction: FlipDirection;
  fromStep: number;
  toStep: number;
  onFlipComplete: () => void;
  renderStep: (step: number) => React.ReactNode;
  className?: string;
}

export function BookPageTurn({
  step,
  isAnimating,
  direction,
  fromStep,
  toStep,
  onFlipComplete,
  renderStep,
  className,
}: BookPageTurnProps) {
  const underStep =
    isAnimating && direction === "forward" ? toStep : fromStep;
  const flipStep =
    isAnimating && direction === "forward" ? fromStep : toStep;

  const flipFrom =
    direction === "forward" ? { rotateY: 0 } : { rotateY: -180 };
  const flipTo =
    direction === "forward" ? { rotateY: -180 } : { rotateY: 0 };

  return (
    <div
      className={cn("book-viewport invite-page-height relative", className)}
      style={{ perspective: 2200 }}
    >
      {!isAnimating ? (
        <div className="book-page-static invite-page-height">{renderStep(step)}</div>
      ) : (
        <>
          <div className="book-page-under invite-page-height absolute inset-0 z-[1]">
            {renderStep(underStep)}
          </div>
          <motion.div
            className="book-page-flip invite-page-height absolute inset-0 z-[2]"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
            }}
            initial={flipFrom}
            animate={flipTo}
            transition={direction === "forward" ? springPage : springPageBack}
            onAnimationComplete={onFlipComplete}
          >
            <div
              className="book-page-face absolute inset-0 overflow-hidden bg-card"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "8px 0 28px rgba(0, 56, 23, 0.12)",
              }}
            >
              {renderStep(flipStep)}
            </div>
            <div
              aria-hidden
              className="book-page-face absolute inset-0 bg-[linear-gradient(90deg,rgba(0,56,23,0.08),transparent_18%,transparent_82%,rgba(0,56,23,0.05)),var(--bg-sand)]"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
