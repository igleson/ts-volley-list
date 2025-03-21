import { type ListingEvent, ListingEventType } from "~/models/ListingEvent";

export type ComputedListing = {
  id: number;
  ownerId: string;
  name: string;
  maxSize: number;
  limitDate: Date | null;
  participants: Participant[];
  invitees: Invitee[];
  payers: (Participant | Invitee)[];
  lastEventDate?: Date;
};

export type Participant = {
  id: string;
};

export type Invitee = {
  inviter_id: string;
  name: string;
};

export function ApplyEvent(
  listing: ComputedListing,
  event: ListingEvent,
): ComputedListing {
  if (event.type === ListingEventType.ADD) {
    return ApplyAddEvent(listing, event);
  }
  return ApplyRemoveEvent(listing, event);
}

function ApplyAddEvent(
  listing: ComputedListing,
  event: ListingEvent,
): ComputedListing {
  if (!listing.maxSize) {
    if (event.isInvitee) {
      listing.invitees.push({
        name: "TODO INVITEE NAME",
        inviter_id: event.userId,
      });
    } else {
      listing.participants.push({
        id: event.userId,
      });
    }
  }

  return listing;
}

function ApplyRemoveEvent(
  listing: ComputedListing,
  event: ListingEvent,
): ComputedListing {
  return listing;
}
