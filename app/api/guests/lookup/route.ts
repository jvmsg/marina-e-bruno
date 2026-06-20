import { NextResponse } from "next/server";
import { isValidBrazilPhone, phoneLookupCandidates } from "@/lib/phone";
import { createServiceClient } from "@/lib/supabase/server";
import type { Guest, GuestLookupResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = body.phone?.trim() ?? "";

    if (!isValidBrazilPhone(phone)) {
      return NextResponse.json(
        { error: "Informe um telefone válido com DDD." },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const candidates = phoneLookupCandidates(phone);

    const { data: matchedGuests, error: matchError } = await supabase
      .from("guests")
      .select("*")
      .in("phone", candidates)
      .limit(1);

    if (matchError) {
      return NextResponse.json({ error: matchError.message }, { status: 500 });
    }

    const matchedGuest = matchedGuests?.[0] as Guest | undefined;

    if (!matchedGuest) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const { data: family, error: familyError } = await supabase
      .from("families")
      .select("id, display_name")
      .eq("id", matchedGuest.family_id)
      .single();

    if (familyError || !family) {
      return NextResponse.json({ error: familyError?.message ?? "Família não encontrada." }, { status: 404 });
    }

    const { data: guests, error: guestsError } = await supabase
      .from("guests")
      .select("*")
      .eq("family_id", matchedGuest.family_id)
      .order("first_name", { ascending: true });

    if (guestsError || !guests?.length) {
      return NextResponse.json({ error: guestsError?.message ?? "Convidados não encontrados." }, { status: 404 });
    }

    const response: GuestLookupResponse = {
      family,
      guests: guests as Guest[],
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
