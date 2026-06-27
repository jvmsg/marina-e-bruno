"use client";

import { useRef } from "react";

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  edgeMargin?: number;
  enabled?: boolean;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 56,
  edgeMargin = 32,
  enabled = true,
}: UseSwipeNavigationOptions) {
  const touchStart = useRef<{
    x: number;
    y: number;
    startedAtLeftEdge: boolean;
  } | null>(null);

  function onTouchStart(event: React.TouchEvent) {
    if (!enabled) {
      return;
    }

    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      startedAtLeftEdge: touch.clientX <= edgeMargin,
    };
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (!enabled || !touchStart.current) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const startedAtLeftEdge = touchStart.current.startedAtLeftEdge;

    touchStart.current = null;

    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      onSwipeLeft?.();
      return;
    }

    if (startedAtLeftEdge) {
      return;
    }

    onSwipeRight?.();
  }

  return {
    onTouchStart,
    onTouchEnd,
  };
}
