"server client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { type ComputedListing } from "~/models/ComputedListing";
import { Invitee, Participant } from "~/app/listings/components/Player";
import { auth } from "@clerk/nextjs/server";
import { GetUserInfo } from "~/lib/UserInformation";
import { zip } from "~/utils/zip";
import { Suspense } from "react";
import { GetMockedComputedListing } from "~/server/queries";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ listingId: number }>;
}) {
  const { listingId } = await params;

  const { userId } = await auth();

  const computedListing: ComputedListing =
    await GetMockedComputedListing(listingId);

  const loggedUserIsTheOwner = userId === computedListing.ownerId;
  const loggedUserAlreadyOnList = computedListing.participants.some(
    (participant) => participant.id === userId,
  );

  const addMeToListing = async () => {
    "use server";
    // return await AddListingEvent({
    //   listingId,
    //   userId: userId!,
    //   type: ListingEventType.ADD,
    //   date: new Date(),
    //   isInvitee: false,
    // });
  };

  return (
    <main className="flex min-h-screen w-[80%] max-w-[600px] min-w-[500px] flex-col items-center justify-center text-white">
      <SignedIn>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-slate-400">
          <div className="grid grid-cols-2 gap-4">
            <h1 className="col-auto flex items-center text-2xl">
              Configurações da Lista
            </h1>
            <br className="col-auto flex items-center" />
            <div className="col-auto flex items-center"> Nome:</div>
            <div className="col-auto flex items-center">
              {computedListing.name}
            </div>

            {computedListing.maxSize && (
              <div className="col-auto flex items-center">
                Número máximo de jogadores:
              </div>
            )}
            {computedListing.maxSize && (
              <div className="col-auto flex items-center">
                {computedListing.maxSize}
              </div>
            )}

            {computedListing.limitDate && (
              <div className="col-auto flex items-center">
                Data limite para sair da lista e não pagar:
              </div>
            )}
            {computedListing.limitDate && (
              <div className="col-auto flex items-center">
                {computedListing.limitDate.toDateString()}
              </div>
            )}
          </div>
          <div className="relative w-full items-center p-2">
            <h1 className="col-auto flex items-center text-2xl">
              Participantes:
            </h1>
            {!loggedUserAlreadyOnList && (
              <button
                onClick={addMeToListing}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
              >
                Me adicionar na lista
              </button>
            )}
            {computedListing.participants.map((participant) => (
              <Participant
                key={participant.id}
                id={participant.id}
                CanRemove={loggedUserIsTheOwner || participant.id === userId}
              ></Participant>
            ))}
          </div>

          <div className="relative w-full items-center p-2">
            <h1 className="col-auto flex items-center text-2xl">
              Convidados:
            </h1>
            {computedListing.invitees.map((invitee) => (
                <Invitee
                    key={`invitee-${invitee.inviter_id}-${invitee.name}`}
                    InviteeName={invitee.name}
                    InviterId={invitee.inviter_id}
                    CanRemove={
                        loggedUserIsTheOwner || invitee.inviter_id === userId
                    }
                ></Invitee>
            ))}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-gray-400">
          Você precisa estar logado para criar ou visualizar listas. Clique no
          botão acima para isso.
        </div>
      </SignedOut>
    </main>
  );
}
