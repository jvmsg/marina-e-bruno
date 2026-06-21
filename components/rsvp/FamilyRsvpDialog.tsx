"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { Guest, GuestLookupResponse, RsvpGuestUpdate } from "@/lib/types";
import { cn } from "@/lib/utils";
import { dialogContent } from "@/lib/motion/variants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { WeddingButton } from "@/components/wedding/wedding-button";

interface FamilyRsvpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  family: GuestLookupResponse["family"];
  guests: Guest[];
  onComplete: (primaryGuest: Guest) => void;
}

type GuestFormState = {
  status: "attending" | "declined";
  dietaryNotes: string;
};

function guestAccent(gender: Guest["gender"]) {
  if (gender === "female") {
    return "text-accent";
  }

  if (gender === "male") {
    return "text-primary";
  }

  return "text-foreground/80";
}

export function FamilyRsvpDialog({
  open,
  onOpenChange,
  onClose,
  family,
  guests,
  onComplete,
}: FamilyRsvpDialogProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialState = useMemo(() => {
    return guests.reduce<Record<string, GuestFormState>>((accumulator, guest) => {
      accumulator[guest.id] = {
        status:
          guest.rsvp_status === "declined" ? "declined" : "attending",
        dietaryNotes: guest.dietary_notes ?? "",
      };
      return accumulator;
    }, {});
  }, [guests]);

  const [formState, setFormState] = useState(initialState);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const payload: RsvpGuestUpdate[] = guests.map((guest) => ({
      guestId: guest.id,
      status: formState[guest.id]?.status ?? "attending",
      dietaryNotes: formState[guest.id]?.dietaryNotes,
    }));

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: family.id,
          guests: payload,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Não foi possível salvar a confirmação.");
        return;
      }

      onComplete(guests[0]);
      router.push("/gifts");
    } catch {
      setError("Não foi possível salvar a confirmação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-auto right-0 bottom-0 left-0 max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-[28px] border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-h-[90vh] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:p-6"
      >
        <motion.div
          key={guests.map((guest) => guest.id).join("-")}
          initial="hidden"
          animate="visible"
          variants={dialogContent}
        >
          <DialogHeader className="mb-5 text-left">
            <Badge variant="secondary" className="mb-2 w-fit uppercase tracking-[0.2em]">
              Confirmação da família
            </Badge>
            <DialogTitle className="font-serif text-2xl text-foreground sm:text-3xl">
              {family.display_name ?? "Seu convite"}
            </DialogTitle>
            <DialogDescription>
              Confirme quem estará presente na celebração.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {guests.map((guest) => {
              const state = formState[guest.id];

              return (
                <div
                  key={guest.id}
                  className="rounded-2xl border border-border bg-muted p-4"
                >
                  <p className={cn("font-medium", guestAccent(guest.gender))}>
                    {guest.first_name} {guest.last_name}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant={state?.status === "attending" ? "default" : "outline"}
                      className="touch-target min-h-11 flex-1 rounded-full text-base sm:min-h-8 sm:text-sm"
                      onClick={() =>
                        setFormState((current) => ({
                          ...current,
                          [guest.id]: {
                            ...current[guest.id],
                            status: "attending",
                          },
                        }))
                      }
                    >
                      Vai
                    </Button>
                    <Button
                      type="button"
                      variant={state?.status === "declined" ? "accent" : "outline"}
                      className="touch-target min-h-11 flex-1 rounded-full text-base sm:min-h-8 sm:text-sm"
                      onClick={() =>
                        setFormState((current) => ({
                          ...current,
                          [guest.id]: {
                            ...current[guest.id],
                            status: "declined",
                          },
                        }))
                      }
                    >
                      Não vai
                    </Button>
                  </div>

                  {state?.status === "attending" && (
                    <Input
                      type="text"
                      placeholder="Restrições alimentares (opcional)"
                      value={state.dietaryNotes}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          [guest.id]: {
                            ...current[guest.id],
                            dietaryNotes: event.target.value,
                          },
                        }))
                      }
                      className="mt-3 h-11 rounded-xl bg-card text-base"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="sticky bottom-0 mt-6 flex gap-3 bg-card pt-3 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:static sm:bg-transparent sm:p-0">
            <WeddingButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancelar
            </WeddingButton>
            <WeddingButton
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? "Salvando..." : "Confirmar e ver presentes"}
            </WeddingButton>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
