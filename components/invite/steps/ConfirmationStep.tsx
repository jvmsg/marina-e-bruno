"use client";

import { useState } from "react";
import { formatPhoneDisplay } from "@/lib/phone";

interface ConfirmationStepProps {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function ConfirmationStep({
  phone,
  onPhoneChange,
  onSubmit,
  loading,
  error,
}: ConfirmationStepProps) {
  const [touched, setTouched] = useState(false);

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
          Confirmação
        </p>
        <h2 className="font-serif text-3xl text-[color:var(--accent-men)]">
          Encontre seu convite
        </h2>
        <p className="mt-3 leading-relaxed text-[color:var(--accent-men)]/80">
          Informe o telefone cadastrado no convite para confirmar a presença da
          sua família.
        </p>
      </div>

      <div className="rounded-2xl bg-[color:var(--bg-sand)] p-5">
        <label htmlFor="phone" className="text-sm font-medium text-[color:var(--accent-men)]">
          Telefone com DDD
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          onBlur={() => setTouched(true)}
          className="mt-2 w-full rounded-xl border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] px-4 py-3 text-[color:var(--accent-men)] outline-none ring-[color:var(--accent-women)] focus:ring-2"
        />
        {touched && phone && (
          <p className="mt-2 text-xs text-[color:var(--accent-men)]/60">
            Buscando por: {formatPhoneDisplay(phone)}
          </p>
        )}
        {error && (
          <p className="mt-3 text-sm text-[color:var(--accent-women)]">{error}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !phone.trim()}
        className="mt-auto rounded-full bg-[color:var(--accent-men)] px-6 py-3 text-sm font-medium text-[color:var(--bg-cream)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Buscando..." : "Encontrar convite"}
      </button>
    </div>
  );
}
