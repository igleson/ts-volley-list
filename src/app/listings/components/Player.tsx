import { type Invitee, type Participant } from "~/models/ComputedListing";
import { GetUserInfo } from "~/lib/UserInformation";
import Image from "next/image";

type ParticipantProps = {
  ParticipantName: string;
  ImageUrl: string;
  CanRemove: boolean;
};

export async function Participant(props: ParticipantProps) {
  return (
    <div className="flex flex-auto items-center">
      <div className="col-auto flex flex-auto items-center">
        <Image
          src={props.ImageUrl}
          alt={props.ParticipantName}
          height="50"
          width="50"
          className="flex aspect-square flex-auto items-center rounded-full object-cover"
        />
        <strong className="flex flex-auto items-center p-3">
          <i>{props.ParticipantName}</i>
        </strong>
      </div>
      <div className="col-auto flex flex-auto items-center">
        <button
          className="bg-gradient-to-r from-red-500 via-red-600 to-red-700"
          disabled={!props.CanRemove}
        >
          Remover
        </button>
      </div>
    </div>
  );
}

type InviteeProps = {
    InviteeName: string;
    InviterName: string;
    InviterImageUrl: string;
    CanRemove: boolean;
};

export async function Invitee(props: InviteeProps) {

  return (
    <>
      <div className="col-auto flex flex-auto items-center">
        <strong className="flex flex-auto items-center">
          <i>{props.InviteeName}</i>
        </strong>
        <div className="p-3"> convidado por:</div>
        <Image
          src={props.InviterImageUrl}
          alt={props.InviterName}
          height="50"
          width="50"
          className="flex aspect-square flex-auto items-center rounded-full object-cover"
        />
        <strong className="flex flex-auto items-center p-2">
          <i>{props.InviterName}</i>
        </strong>
      </div>
      <div className="col-auto flex flex-auto items-center">
        <button
          className="bg-gradient-to-r from-red-500 via-red-600 to-red-700"
          disabled={!props.CanRemove}
        >
          Remover
        </button>
      </div>
    </>
  );
}
