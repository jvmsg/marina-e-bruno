"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest, GuestLookupResponse, RsvpGuestUpdate } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FamilyRsvpDialogProps {
  open: boolean;
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
    return "text-[color:var(--accent-women)]";
  }

  if (gender === "male") {
    return "text-[color:var(--accent-men)]";
  }

  return "text-[color:var(--accent-men)]/80";
}

export function FamilyRsvpDialog({
  open,
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
          guest.rsvp_status === "declined"
            ? "declined"
            : "attending",
        dietaryNotes: guest.dietary_notes ?? "",
      };
      return accumulator;
    }, {});
  }, [guests]);

  const [formState, setFormState] = useState(initialState);

  if (!open) {
    return null;
  }

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[color:var(--accent-men)]/35 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-dialog-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-[color:var(--bg-cream)] p-6 shadow-2xl"
      >
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
            Confirmação da família
          </p>
          <h2 id="rsvp-dialog-title" className="font-serif text-3xl text-[color:var(--accent-men)]">
            {family.display_name ?? "Seu convite"}
          </h2>
          <p className="mt-2 text-sm text-[color:var(--accent-men)]/75">
            Confirme quem estará presente na celebração.
          </p>
        </div>

        <div className="space-y-4">
          {guests.map((guest) => {
            const state = formState[guest.id];

            return (
              <div
                key={guest.id}
                className="rounded-2xl border border-[color:var(--bg-taupe)] bg-[color:var(--bg-sand)] p-4"
              >
                <p className={cn("font-medium", guestAccent(guest.gender))}>
                  {guest.first_name} {guest.last_name}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        [guest.id]: { ...current[guest.id], status: "attending" },
                      }))
                    }
                    className={cn(
                      "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
                      state?.status === "attending"
                        ? "bg-[color:var(--accent-men)] text-[color:var(--bg-cream)]"
                        : "border border-[color:var(--bg-taupe)] text-[color:var(--accent-men)]",
                    )}
                  >
                    Vai
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        [guest.id]: { ...current[guest.id], status: "declined" },
                      }))
                    }
                    className={cn(
                      "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
                      state?.status === "declined"
                        ? "bg-[color:var(--accent-women)] text-white"
                        : "border border-[color:var(--bg-taupe)] text-[color:var(--accent-men)]",
                    )}
                  >
                    Não vai
                  </button>
                </div>

                {state?.status === "attending" && (
                  <input
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
                    className="mt-3 w-full rounded-xl border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] px-3 py-2 text-sm text-[color:var(--accent-men)] outline-none ring-[color:var(--accent-women)] focus:ring-2"
                  />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 text-sm text-[color:var(--accent-women)]">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-full border border-[color:var(--bg-taupe)] px-4 py-3 text-sm font-medium text-[color:var(--accent-men)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-full bg-[color:var(--accent-men)] px-4 py-3 text-sm font-medium text-[color:var(--bg-cream)] disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Confirmar e ver presentes"}
          </button>
        </div>
      </div>
    </div>
  );
}
