"use client";

import { useState } from "react";
import { formatPhoneDisplay } from "@/lib/phone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InviteHeading } from "@/components/wedding/invite-heading";
import { WeddingButton } from "@/components/wedding/wedding-button";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";

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
    <StaggerChildren
      stepKey="confirmation"
      className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto px-5 py-4"
    >
      <StaggerItem>
        <InviteHeading
          eyebrow="Confirmação"
          title="Encontre seu convite"
          description="Informe o telefone cadastrado no convite para confirmar a presença da sua família."
        />
      </StaggerItem>

      <StaggerItem>
        <div className="rounded-2xl bg-muted p-5">
          <Label htmlFor="phone">Telefone com DDD</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            onBlur={() => setTouched(true)}
            className="mt-2 h-11 rounded-xl bg-card text-base"
          />
          {touched && phone && (
            <p className="mt-2 text-xs text-muted-foreground">
              Buscando por: {formatPhoneDisplay(phone)}
            </p>
          )}
          {error && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </StaggerItem>

      <StaggerItem className="mt-auto">
        <WeddingButton
          type="button"
          onClick={onSubmit}
          disabled={loading || !phone.trim()}
          className="w-full"
        >
          {loading ? "Buscando..." : "Encontrar convite"}
        </WeddingButton>
      </StaggerItem>
    </StaggerChildren>
  );
}
