import type { RsvpSession } from "@/lib/types";

const RSVP_SESSION_KEY = "wedding-rsvp-session";

export function saveRsvpSession(session: RsvpSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(RSVP_SESSION_KEY, JSON.stringify(session));
}

export function loadRsvpSession(): RsvpSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(RSVP_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RsvpSession;
  } catch {
    return null;
  }
}
