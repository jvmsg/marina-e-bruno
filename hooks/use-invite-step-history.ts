"use client";

import { useCallback, useEffect, useRef } from "react";

const HISTORY_STATE_KEY = "inviteStep";

type InviteHistoryState = {
  [HISTORY_STATE_KEY]: number;
};

function readStepFromState(state: unknown): number | null {
  if (state && typeof state === "object" && HISTORY_STATE_KEY in state) {
    const value = (state as InviteHistoryState)[HISTORY_STATE_KEY];
    if (typeof value === "number" && value >= 0) {
      return value;
    }
  }

  return null;
}

export function useInviteStepHistory(
  step: number,
  goToStep: (next: number) => void,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (readStepFromState(window.history.state) === null) {
      window.history.replaceState({ [HISTORY_STATE_KEY]: stepRef.current }, "");
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function onPopState(event: PopStateEvent) {
      const historyStep = readStepFromState(event.state);
      if (historyStep === null || historyStep === stepRef.current) {
        return;
      }

      goToStep(historyStep);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [enabled, goToStep]);

  const navigateToStep = useCallback(
    (next: number) => {
      if (!enabled) {
        goToStep(next);
        return;
      }

      const current = stepRef.current;
      if (next === current) {
        return;
      }

      if (next > current) {
        window.history.pushState({ [HISTORY_STATE_KEY]: next }, "");
        goToStep(next);
        return;
      }

      window.history.back();
    },
    [enabled, goToStep],
  );

  return { navigateToStep };
}
