export type ListingEvent = {
  userId: string;
  listingId: number;
  date: Date;
  isInvitee: boolean;
  type: ListingEventType;
};

export enum ListingEventType {
  ADD = "ADD",
  REMOVE = "REMOVE"
}
