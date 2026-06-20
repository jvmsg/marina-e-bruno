import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { RsvpGuestUpdate } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      familyId?: string;
      guests?: RsvpGuestUpdate[];
    };

    const familyId = body.familyId?.trim();
    const guests = body.guests ?? [];

    if (!familyId || guests.length === 0) {
      return NextResponse.json(
        { error: "Informe a família e as confirmações de presença." },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    for (const guest of guests) {
      if (guest.status !== "attending" && guest.status !== "declined") {
        return NextResponse.json({ error: "Status de presença inválido." }, { status: 400 });
      }

      const { data: existingGuest, error: fetchError } = await supabase
        .from("guests")
        .select("id, family_id")
        .eq("id", guest.guestId)
        .single();

      if (fetchError || !existingGuest) {
        return NextResponse.json({ error: "Convidado não encontrado." }, { status: 404 });
      }

      if (existingGuest.family_id !== familyId) {
        return NextResponse.json({ error: "Convidado não pertence a esta família." }, { status: 403 });
      }

      const { error: updateError } = await supabase
        .from("guests")
        .update({
          rsvp_status: guest.status,
          dietary_notes: guest.dietaryNotes?.trim() || null,
        })
        .eq("id", guest.guestId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
