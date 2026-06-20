"use client";

import { useMemo, useState } from "react";
import { weddingContent } from "@/lib/content";
import { saveRsvpSession } from "@/lib/rsvp-session";
import type { Guest, GuestLookupResponse } from "@/lib/types";
import { PaperCard } from "@/components/invite/PaperCard";
import { StepProgress } from "@/components/invite/StepProgress";
import { CoverStep } from "@/components/invite/steps/CoverStep";
import { StoryStep } from "@/components/invite/steps/StoryStep";
import { DetailsStep } from "@/components/invite/steps/DetailsStep";
import { ScheduleStep } from "@/components/invite/steps/ScheduleStep";
import { ConfirmationStep } from "@/components/invite/steps/ConfirmationStep";
import { FamilyRsvpDialog } from "@/components/rsvp/FamilyRsvpDialog";

const TOTAL_STEPS = 5;

export function InviteStepper() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupData, setLookupData] = useState<GuestLookupResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLastStep = step === TOTAL_STEPS - 1;

  const stepLabels = useMemo(
    () => ["Capa", "História", "Detalhes", "Programação", "Confirmação"],
    [],
  );

  async function handleLookup() {
    setLookupLoading(true);
    setLookupError(null);

    try {
      const response = await fetch("/api/guests/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = (await response.json()) as GuestLookupResponse & { error?: string };

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
  }

  function handleRsvpComplete(primaryGuest: Guest) {
    saveRsvpSession({
      familyId: lookupData?.family.id ?? primaryGuest.family_id,
      guestId: primaryGuest.id,
    });
    setDialogOpen(false);
  }

  return (
    <>
      <section className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8 sm:py-12">
        <div className="mb-6 text-center">
          <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[color:var(--accent-men)]/60">
            {stepLabels[step]}
          </p>
        </div>

        <PaperCard className="min-h-[560px] flex-1">
          <div className="relative z-10 flex h-full min-h-[480px] flex-col">
            {step === 0 && <CoverStep />}
            {step === 1 && <StoryStep />}
            {step === 2 && <DetailsStep />}
            {step === 3 && <ScheduleStep />}
            {step === 4 && (
              <ConfirmationStep
                phone={phone}
                onPhoneChange={setPhone}
                onSubmit={handleLookup}
                loading={lookupLoading}
                error={lookupError}
              />
            )}
          </div>
        </PaperCard>

        {!isLastStep && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0}
              className="rounded-full border border-[color:var(--bg-taupe)] px-5 py-3 text-sm font-medium text-[color:var(--accent-men)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1))}
              className="rounded-full bg-[color:var(--accent-women)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Próximo
            </button>
          </div>
        )}
      </section>

      {lookupData && (
        <FamilyRsvpDialog
          key={lookupData.family.id}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          family={lookupData.family}
          guests={lookupData.guests}
          onComplete={handleRsvpComplete}
        />
      )}
    </>
  );
}
