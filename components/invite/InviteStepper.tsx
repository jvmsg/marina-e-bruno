"use client";

import { useCallback, useMemo, useState } from "react";
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
import { StepProgress } from "@/components/invite/StepProgress";
import { FamilyRsvpDialog } from "@/components/rsvp/FamilyRsvpDialog";
import { MobileShell } from "@/components/wedding/mobile-shell";
import { PaperCard } from "@/components/wedding/paper-card";
import { WeddingButton } from "@/components/wedding/wedding-button";

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

  const stepLabels = useMemo(
    () => ["Capa", "História", "Detalhes", "Programação", "Confirmação"],
    [],
  );

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
      <MobileShell className="pb-28 sm:pb-12">
        <div className="mb-4 text-center sm:mb-6">
          <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:tracking-[0.25em]">
            {stepLabels[step]}
          </p>
        </div>

        <PaperCard
          className={cn(isAnimating && "overflow-visible")}
          sheen={step !== 0 && !isAnimating}
        >
          <div {...swipeHandlers} className="touch-pan-y">
            <BookPageTurn
              step={step}
              isAnimating={isAnimating}
              direction={direction}
              fromStep={fromStep}
              toStep={toStep}
              onFlipComplete={finishFlip}
              renderStep={renderStep}
            />
          </div>
        </PaperCard>

        {!isLastStep && (
          <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-4 py-3 backdrop-blur-sm sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3">
              <WeddingButton
                type="button"
                variant="outline"
                onClick={() => goToStep(Math.max(step - 1, 0))}
                disabled={step === 0 || isAnimating}
                className="flex-1 sm:flex-none"
              >
                Voltar
              </WeddingButton>
              <WeddingButton
                type="button"
                variant="accent"
                onClick={() => goToStep(Math.min(step + 1, TOTAL_STEPS - 1))}
                disabled={isAnimating}
                className="flex-1 sm:flex-none"
              >
                Próximo
              </WeddingButton>
            </div>
          </div>
        )}
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
