export type ListingEvent = {
  userId: string;
  listingId: number;
  isInvitee: boolean;
  inviteeName?: string;
  type: ListingEventType;
};

export enum ListingEventType {
  ADD = "ADD",
  REMOVE = "REMOVE"
}
