export type ComputedListing = {
  id: string;
  name: string;
  maxSize: number | null;
  limitDate: Date | null;
  participants: Participant[];
  invitees: Participant[];
  payers: string[];
};

export type Participant = {
  id: string;
  name: string;
};
