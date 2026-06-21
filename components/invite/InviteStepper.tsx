"use client";

import { useCallback, useState } from "react";
import { weddingContent } from "@/lib/content";
import { useBookNavigation } from "@/hooks/use-book-navigation";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
import { saveRsvpSession } from "@/lib/rsvp-session";
import type { Guest, GuestLookupResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookPageTurn } from "@/components/motion/book-page-turn";
import { CoverStep } from "@/components/invite/steps/CoverStep";
import { StoryStep } from "@/components/invite/steps/StoryStep";
import { DetailsStep } from "@/components/invite/steps/DetailsStep";
import { ScheduleStep } from "@/components/invite/steps/ScheduleStep";
import { ConfirmationStep } from "@/components/invite/steps/ConfirmationStep";
import { FamilyRsvpDialog } from "@/components/rsvp/FamilyRsvpDialog";
import { PageTurnIndicator } from "@/components/invite/PageTurnIndicator";
import { MobileShell } from "@/components/wedding/mobile-shell";
import { PaperCard } from "@/components/wedding/paper-card";

const TOTAL_STEPS = 5;

export function InviteStepper() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupData, setLookupData] = useState<GuestLookupResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    isAnimating,
    direction,
    fromStep,
    toStep,
    goToStep,
    finishFlip,
  } = useBookNavigation(step, setStep);

  const isLastStep = step === TOTAL_STEPS - 1;

  const handleLookup = useCallback(async () => {
    setLookupLoading(true);
    setLookupError(null);

    try {
      const response = await fetch("/api/guests/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = (await response.json()) as GuestLookupResponse & {
        error?: string;
      };

      if (!response.ok) {
        if (data.error === "not_found") {
          setLookupError(weddingContent.messages.phoneNotFound);
        } else {
          setLookupError(data.error ?? weddingContent.messages.phoneNotFound);
        }
        return;
      }

      setLookupData(data);
      setDialogOpen(true);
    } catch {
      setLookupError("Não foi possível buscar o convite. Tente novamente.");
    } finally {
      setLookupLoading(false);
    }
  }, [phone]);

  function handleRsvpComplete(primaryGuest: Guest) {
    saveRsvpSession({
      familyId: lookupData?.family.id ?? primaryGuest.family_id,
      guestId: primaryGuest.id,
    });
    setDialogOpen(false);
  }

  const renderStep = useCallback(
    (currentStep: number) => {
      switch (currentStep) {
        case 0:
          return <CoverStep />;
        case 1:
          return <StoryStep />;
        case 2:
          return <DetailsStep />;
        case 3:
          return <ScheduleStep />;
        case 4:
          return (
            <ConfirmationStep
              phone={phone}
              onPhoneChange={setPhone}
              onSubmit={handleLookup}
              loading={lookupLoading}
              error={lookupError}
            />
          );
        default:
          return null;
      }
    },
    [handleLookup, lookupError, lookupLoading, phone],
  );

  const swipeHandlers = useSwipeNavigation({
    enabled: !isAnimating && !isLastStep && !dialogOpen,
    onSwipeLeft: () => goToStep(Math.min(step + 1, TOTAL_STEPS - 1)),
    onSwipeRight: () => goToStep(Math.max(step - 1, 0)),
  });

  return (
    <>
      <MobileShell fullScreen>
        <PaperCard
          className={cn(isAnimating && "overflow-visible")}
          sheen={step !== 0 && !isAnimating}
          fullScreen
        >
          <div
            {...swipeHandlers}
            className={cn(
              "touch-pan-y flex min-h-0 flex-1 flex-col pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-0",
              !isLastStep && "pb-14 sm:pb-16",
            )}
          >
            <BookPageTurn
              step={step}
              isAnimating={isAnimating}
              direction={direction}
              fromStep={fromStep}
              toStep={toStep}
              onFlipComplete={finishFlip}
              renderStep={renderStep}
              className="min-h-0 flex-1"
            />
          </div>

          <PageTurnIndicator
            step={step}
            totalSteps={TOTAL_STEPS}
            onPrevious={() => goToStep(Math.max(step - 1, 0))}
            onNext={() => goToStep(Math.min(step + 1, TOTAL_STEPS - 1))}
            disabled={isAnimating}
          />
        </PaperCard>
      </MobileShell>

      {lookupData && (
        <FamilyRsvpDialog
          key={lookupData.family.id}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onClose={() => setDialogOpen(false)}
          family={lookupData.family}
          guests={lookupData.guests}
          onComplete={handleRsvpComplete}
        />
      )}
    </>
  );
}
