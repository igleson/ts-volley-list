export type ComputedListing = {
  id: string;
  name: string;
  maxSize: number | null;
  limitDate: Date | null;
  participants: Participant[];
  invitees: Invitee[];
  payers: (Participant | Invitee)[];
};

export type Participant = {
  id: string;
};

export type Invitee = {
  inviter_id: string;
  name: string;
};
