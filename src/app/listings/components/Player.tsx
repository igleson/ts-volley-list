"use client";

import Image from "next/image";
import { GetUserInfo } from "~/lib/UserInformation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { AddListingEvent } from "~/server/queries";
import { ListingEventType } from "~/models/ListingEvent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";

type ParticipantProps = {
  listingId: number;
  id: string;
  CanRemove: boolean;
};

function LoadingParticipant() {
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
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-three-dots-vertical"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </svg>
        </button>
        <svg
          className="flex aspect-square h-[50px] max-h-[50px] w-[50px] max-w-[50px] flex-auto items-center rounded-full object-cover dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
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
    <Suspense fallback={<LoadingParticipant />}>
      <div className="flex flex-auto items-center rounded-md border border-purple-500 p-2">
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
            className="rounded-full border border-red-400 p-2"
            disabled={!props.CanRemove}
          >
            <span className="font-semibold text-red-400">Remover</span>
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
  CanPromote: boolean;
};

export function LoadingInvitee(props: InviteeProps) {
  return (
    <>
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
          <strong className="px-1">
            <i>carregando...</i>
          </strong>
          <div className="px-1"> convidou:</div>

          <strong className="flex flex-auto items-center px-1">
            <i>{props.InviteeName}</i>
          </strong>
        </div>
        <div className="col-auto items-end">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-three-dots-vertical"
              viewBox="0 0 16 16"
            >
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            </svg>
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
          CanPromote={props.CanPromote}
          listingId={props.listingId}
          InviterId={props.InviterId}
        />
      }
    >
      <div className="flex flex-auto items-center rounded-md border-[1px] border-purple-500 p-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border border-purple-500 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gradient-to-br from-purple-950 to-purple-700 text-white">
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={!props.CanRemove}>
                  Remover
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={!props.CanPromote}>
                  Promover
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Suspense>
  );
}
