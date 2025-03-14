'use client'

import { type Invitee, type Participant } from "~/models/ComputedListing";
import Image from "next/image";
import { GetUserInfo } from "~/lib/UserInformation";
import { useEffect, useState } from "react";

type ParticipantProps = {
  id: string;
  CanRemove: boolean;
};

function ParticipantLoading() {
  return (
    <div className="flex flex-auto items-center rounded-md border border-slate-700 p-4">
      <div className="flex animate-pulse space-x-4">
        <div className="size-12 rounded-full bg-slate-400"></div>
        <strong className="flex flex-auto items-center p-3">
          <i>nome</i>
        </strong>
      </div>
      <div className="col-auto flex flex-auto items-center">
        <button
          className="border border-slate-700 p-4 bg-slate-400"
          disabled={true}
        >
          Remover
        </button>
      </div>
    </div>);
}

export function Participant(props: ParticipantProps) {

  const [pending, setPending] = useState<boolean>(true);
  const [[name, imageUrl], setUserInfo] = useState<(string | null)[]>([]);

  useEffect(() => {
    GetUserInfo(props.id)
      .then(setUserInfo)
      .then(() => setPending(false));
  }, [props.id]);

  if (pending) return <ParticipantLoading/>

  return (
    <div className="flex flex-auto items-center">
      <div className="col-auto flex flex-auto items-center">
        <Image
          src={imageUrl!}
          alt={name!}
          height="50"
          width="50"
          className="flex aspect-square flex-auto items-center rounded-full object-cover"
        />
        <strong className="flex flex-auto items-center p-3">
          <i>{name}</i>
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
  InviterId: string;
  CanRemove: boolean;
};

export function Invitee(props: InviteeProps) {

  const [pending, setPending] = useState<boolean>(true);
  const [[InviterName, InviterImageUrl], setUserInfo] = useState<(string | null)[]>([]);

  useEffect(() => {
    GetUserInfo(props.InviterId)
      .then(setUserInfo)
      .then(() => setPending(false));
  }, [props.InviterId]);

  if (pending) return (<p>loading</p>)

  return (
    <>
      <div className="col-auto flex flex-auto items-center">
        <strong className="flex flex-auto items-center">
          <i>{props.InviteeName}</i>
        </strong>
        <div className="p-3"> convidado por:</div>
        <Image
          src={InviterImageUrl!}
          alt={InviterName!}
          height="50"
          width="50"
          className="flex aspect-square flex-auto items-center rounded-full object-cover"
        />
        <strong className="flex flex-auto items-center p-2">
          <i>{InviterName}</i>
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
