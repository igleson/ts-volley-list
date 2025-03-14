"use client";

import Image from "next/image";
import { GetUserInfo } from "~/lib/UserInformation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ParticipantProps = {
  id: string;
  CanRemove: boolean;
};

export function Participant(props: ParticipantProps) {
  const [pending, setPending] = useState<boolean>(true);
  const [[name, imageUrl], setUserInfo] = useState<(string | null)[]>([]);

  useEffect(() => {
    GetUserInfo(props.id)
      .then(setUserInfo)
      .then(() => setPending(false))
      .catch((_) => {
        toast("aconteceu um erro ao carregar as informações do usuário");
        setPending(false);
      });
  }, [props.id]);

  return (
    <div
      className={`flex flex-auto items-center rounded-md border-[1px] p-2 ${pending ? "animate-pulse border-gray-700" : "border-purple-500"} `}
    >
      <div className="col-auto flex flex-auto items-center">
        <>
          {pending ? (
            <svg
              className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          ) : (
            <Image
              src={imageUrl!}
              alt={name!}
              height="50"
              width="50"
              className="flex aspect-square max-h-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover"
            />
          )}
        </>

        <strong className="flex flex-auto items-center px-3">
          <i>{pending ? "carregando..." : name}</i>
        </strong>
      </div>
      <div className="col-auto items-end">
        <button
          className={`via-red-450 h-full ${pending ? "bg-gray-500" : "bg-gradient-to-r from-red-400 to-red-500"} `}
          disabled={pending || !props.CanRemove}
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
  const [[InviterName, InviterImageUrl], setUserInfo] = useState<
    (string | null)[]
  >([]);

  useEffect(() => {
    GetUserInfo(props.InviterId)
      .then(setUserInfo)
      .then(() => setPending(false))
      .catch((_) => {
        toast("aconteceu um erro ao carregar as informações do usuário");
        setPending(false);
      });
  }, [props.InviterId]);

  return (
    <>
      <div
        className={`flex flex-auto items-center rounded-md border-[1px] p-2 ${pending ? "animate-pulse border-gray-700" : "border-purple-500"} `}
      >
        <div className="col-auto flex flex-auto items-center">
          <strong className="p-1">
            <i>{props.InviteeName}</i>
          </strong>
          <div className="p-1"> convidado por:</div>
          {pending ? (
            <svg
              className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          ) : (
            <Image
              src={InviterImageUrl!}
              alt={InviterName!}
              height="50"
              width="50"
              className="flex aspect-square max-h-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover"
            />
          )}

          <strong className="flex flex-auto items-center p-2">
            <i>{pending ? "carregando..." : InviterName}</i>
          </strong>
        </div>
        <div className="col-auto items-end">
          <button
              className={`via-red-450 h-full ${pending ? "bg-gray-500" : "bg-gradient-to-r from-red-400 to-red-500"} `}
              disabled={pending || !props.CanRemove}
          >
            Remover
          </button>
        </div>
      </div>
    </>
  );
}
