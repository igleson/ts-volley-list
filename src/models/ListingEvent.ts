export type ListingEvent = {
  userId: string;
  listingId: string;
  date: Date;
  isInvitee: boolean;
  type: ListingEventType;
};

export enum ListingEventType {
  ADD = "ADD",
  REMOVE = "REMOVE"
}
