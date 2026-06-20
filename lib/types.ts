export type GuestGender = "female" | "male" | "other";
export type RsvpStatus = "pending" | "attending" | "declined";
export type GiftOrderStatus = "pending" | "paid" | "failed";

export interface Family {
  id: string;
  display_name: string | null;
  created_at: string;
}

export interface Guest {
  id: string;
  family_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: GuestGender;
  rsvp_status: RsvpStatus;
  dietary_notes: string | null;
  updated_at: string;
}

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  stripe_price_id: string;
  image_path: string | null;
  active: boolean;
  sort_order: number;
}

export interface GuestLookupResponse {
  family: Pick<Family, "id" | "display_name">;
  guests: Guest[];
}

export interface RsvpGuestUpdate {
  guestId: string;
  status: Exclude<RsvpStatus, "pending">;
  dietaryNotes?: string;
}

export interface RsvpSession {
  familyId: string;
  guestId: string;
}
