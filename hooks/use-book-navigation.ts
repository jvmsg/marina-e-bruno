"use client";

import { useCallback, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type FlipDirection = "forward" | "backward";

export function useBookNavigation(
  step: number,
  onStepChange: (step: number) => void,
) {
  const reduceMotion = useReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<FlipDirection>("forward");
  const [fromStep, setFromStep] = useState(0);
  const [toStep, setToStep] = useState(0);

  const finishFlip = useCallback(() => {
    setIsAnimating(false);
    onStepChange(toStep);
  }, [onStepChange, toStep]);

  const goToStep = useCallback(
    (next: number) => {
      if (next === step || isAnimating) {
        return;
      }

      if (reduceMotion) {
        onStepChange(next);
        return;
      }

      setDirection(next > step ? "forward" : "backward");
      setFromStep(step);
      setToStep(next);
      setIsAnimating(true);
    },
    [isAnimating, onStepChange, reduceMotion, step],
  );

  return {
    isAnimating,
    direction,
    fromStep,
    toStep,
    goToStep,
    finishFlip,
  };
}
