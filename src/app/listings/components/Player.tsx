"use client";

import Image from "next/image";
import { GetUserInfo } from "~/lib/UserInformation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { AddListingEvent } from "~/server/queries";
import { ListingEventType } from "~/models/ListingEvent";

type ParticipantProps = {
  listingId: number;
  id: string;
  CanRemove: boolean;
};

type LoadingParticipantProps = {
  CanRemove: boolean;
};

function LoadingParticipant(props: LoadingParticipantProps) {
  return (
    <div className="loading-animation flex flex-auto items-center rounded-md border-[1px] p-2">
      <div className="col-auto flex flex-auto items-center">
        <svg
          className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>

        <strong className="flex flex-auto items-center px-3">
          <i>carregando...</i>
        </strong>
      </div>
      <div className="col-auto items-end">
        <button
          className={`h-full ${props.CanRemove ? "" : "invisible"} bg-gray-500 loading-animation`}
          disabled={true}
        >
          Remover
        </button>
      </div>
    </div>
  );
}

export function Participant(props: ParticipantProps) {
  const [[name, imageUrl], setUserInfo] = useState<(string | null)[]>([
    "carregando...",
    null,
  ]);

  const removePlayerFromListing = async () => {
    const event = await AddListingEvent({
      listingId: props.listingId,
      userId: props.id,
      type: ListingEventType.REMOVE,
      isInvitee: false,
    });
    toast(`participante ${name} removido`);
  };

  useEffect(() => {
    GetUserInfo(props.id)
      .then(setUserInfo)
      .catch((_) => {
        toast("aconteceu um erro ao carregar as informações do usuário");
      });
  }, [props.id]);

  return (
    <Suspense fallback={<LoadingParticipant CanRemove={props.CanRemove} />}>
      <div className="flex flex-auto items-center rounded-md border-[1px] border-purple-500 p-2">
        <div className="col-auto flex flex-auto items-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name!}
              height="50"
              width="50"
              className="flex aspect-square max-h-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover"
            />
          ) : (
            <svg
              className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          )}

          <strong className="flex flex-auto items-center px-3">
            <i>{name}</i>
          </strong>
        </div>
        <div className="col-auto items-end">
          <button
            className={`via-red-450 h-full ${props.CanRemove ? "" : "invisible"} bg-gradient-to-r from-red-400 to-red-500`}
            disabled={!props.CanRemove}
            onClick={() => {
              // if (props.CanRemove) removePlayerFromListing();
            }}
          >
            Remover
          </button>
        </div>
      </div>
    </Suspense>
  );
}

type InviteeProps = {
  listingId: number;
  InviteeName: string;
  InviterId: string;
  CanRemove: boolean;
};

export function LoadingInvitee(props: InviteeProps) {
  return (
    <>
      <div
        className="loading-animation flex flex-auto items-center rounded-md border-[1px] p-2"
      >
        <div className="col-auto flex flex-auto items-center">
          <svg
            className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          <strong className="px-1">
            <i>carregando...</i>
          </strong>
          <div className="px-1"> convidou:</div>

          <strong className="flex flex-auto items-center px-1">
            <i>{props.InviteeName}</i>
          </strong>
        </div>
        <div className="col-auto items-end">
          <button
            className="via-red-450 loading-animation h-full"
            disabled={!props.CanRemove}
          >
            Remover
          </button>
        </div>
      </div>
    </>
  );
}

export function Invitee(props: InviteeProps) {
  const [[InviterName, InviterImageUrl], setUserInfo] = useState<
    (string | null)[]
  >(["carregando...", null]);

  const removeInviteFromListing = async () => {
    const event = await AddListingEvent({
      listingId: props.listingId,
      userId: props.InviterId,
      type: ListingEventType.REMOVE,
      inviteeName: props.InviteeName,
      isInvitee: true,
    });
    toast(`convidado ${props.InviteeName} removido`);
  };

  useEffect(() => {
    GetUserInfo(props.InviterId)
      .then(setUserInfo)
      .catch((_) => {
        toast("aconteceu um erro ao carregar as informações do usuário");
      });
  }, [props.InviterId]);

  return (
    <Suspense
      fallback={
        <LoadingInvitee
          InviteeName={props.InviteeName}
          CanRemove={props.CanRemove}
          listingId={props.listingId}
          InviterId={props.InviterId}
        />
      }
    >
      <div
        className="flex flex-auto items-center rounded-md border-[1px] border-purple-500 p-2"
      >
        <div className="col-auto flex flex-auto items-center">
          {InviterImageUrl ? (
            <Image
              src={InviterImageUrl}
              alt={InviterName!}
              height="50"
              width="50"
              className="flex aspect-square max-h-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover"
            />
          ) : (
            <svg
              className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          )}
          <strong className="px-1">
            <i>{InviterName}</i>
          </strong>
          <div className="px-1"> convidou:</div>

          <strong className="flex flex-auto items-center px-1">
            <i>{props.InviteeName}</i>
          </strong>
        </div>
        <div className="col-auto items-end">
          <button
            className="via-red-450 h-full bg-gradient-to-r from-red-400 to-red-500"
            disabled={!props.CanRemove}
            onClick={() => {
              // if (props.CanRemove) removeInviteFromListing();
            }}
          >
            Remover
          </button>
        </div>
      </div>
    </Suspense>
  );
}
