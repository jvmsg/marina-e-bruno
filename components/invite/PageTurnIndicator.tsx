"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FoldCornerProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

function FoldCorner({
  direction,
  onClick,
  disabled,
  label,
}: FoldCornerProps) {
  const isRight = direction === "right";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "group absolute bottom-[max(0px,env(safe-area-inset-bottom))] z-30 h-[4.25rem] w-[4.25rem] touch-manipulation",
        "transition-opacity disabled:pointer-events-none disabled:opacity-35",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isRight ? "right-0" : "left-0",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 h-[3.75rem] w-[3.75rem] bg-secondary",
          "shadow-[inset_1px_1px_0_rgba(255,255,255,0.45),inset_-1px_-1px_3px_rgba(0,56,23,0.08)]",
          isRight ? "right-0" : "left-0",
        )}
        style={{
          clipPath: isRight
            ? "polygon(100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 100%, 0 100%)",
        }}
      />

      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 h-[2.85rem] w-[2.85rem] bg-card",
          "shadow-[-1px_1px_4px_rgba(0,56,23,0.14)] transition-transform duration-200",
          "group-hover:scale-[1.04] group-active:scale-[0.96]",
          isRight
            ? "right-0 origin-bottom-right"
            : "left-0 origin-bottom-left",
        )}
        style={{
          clipPath: isRight
            ? "polygon(100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 100%, 0 100%)",
        }}
      />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 h-px w-14 bg-border/70",
          isRight
            ? "right-0 origin-bottom-right -rotate-45"
            : "left-0 origin-bottom-left rotate-45",
        )}
      />

      <span
        className={cn(
          "absolute flex size-8 items-center justify-center text-primary/65 transition-colors",
          "group-hover:text-accent group-disabled:text-muted-foreground",
          isRight ? "bottom-2 right-2" : "bottom-2 left-2",
        )}
      >
        {isRight ? (
          <ChevronRight className="size-5" strokeWidth={1.75} />
        ) : (
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        )}
      </span>
    </button>
  );
}

interface PageTurnIndicatorProps {
  step: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export function PageTurnIndicator({
  step,
  totalSteps,
  onPrevious,
  onNext,
  disabled,
}: PageTurnIndicatorProps) {
  const canGoPrevious = step > 0;
  const canGoNext = step < totalSteps - 1;

  if (!canGoPrevious && !canGoNext) {
    return null;
  }

  return (
    <>
      {canGoPrevious && (
        <FoldCorner
          direction="left"
          onClick={onPrevious}
          disabled={disabled}
          label="Página anterior"
        />
      )}
      {canGoNext && (
        <FoldCorner
          direction="right"
          onClick={onNext}
          disabled={disabled}
          label="Próxima página"
        />
      )}
    </>
  );
}
