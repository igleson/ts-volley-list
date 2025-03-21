
import { ListingEventType } from "~/models/ListingEvent";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { type ComputedListing } from "~/models/ComputedListing";
import { Invitee, Participant } from "~/app/listings/components/Player";
import { auth } from "@clerk/nextjs/server";
import { AddListingEvent, GetMockedComputedListing } from "~/server/queries";
import { Suspense } from "react";

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
  const loggedUserAlreadyOnParticipantList = computedListing.participants.some(
    (participant) => participant.id === userId,
  );

  const addCurrentUserToListing = async () => {
    "use server";
    return await AddListingEvent({
      listingId,
      userId: userId!,
      type: ListingEventType.ADD,
      isInvitee: false,
    });
  };

  return (
    <main className="flex min-h-screen w-[80%] min-w-[450px] max-w-[600px] flex-col  p-3 text-white">
      <SignedIn>
        <div className="container flex flex-col gap-12 px-4 py-16 text-slate-400">
          <h1 className="flex justify-start text-2xl">
            Configurações da Lista
          </h1>
          <div className="grid grid-cols-2 gap-4">
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
            <h1 className={`col-auto flex items-center text-2xl`}>
              Participantes:
            </h1>
            {!loggedUserAlreadyOnParticipantList && (
              <div className="py-3">
                <button
                  // onClick={addCurrentUserToListing}
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-10"
                >
                  Me adicionar na lista
                </button>
              </div>
            )}
            {computedListing.participants.map((participant) => (
              <div key={participant.id} className="py-1">
                <Participant
                  listingId={listingId}
                  key={participant.id}
                  id={participant.id}
                  CanRemove={loggedUserIsTheOwner || participant.id === userId}
                />
              </div>
            ))}
          </div>

          <div className="relative w-full items-center p-2">
            <h1 className="col-auto flex items-center text-2xl">Convidados:</h1>

            <div className="grid grid-cols-2 gap-8 py-3">
              <input
                className="col-auto flex items-start rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                placeholder="convidado"
              />
              <div className="col-auto flex items-start justify-end">
                <button
                  // onClick={addCurrentUserToListing}
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-2"
                >
                  Adicionar convidado
                </button>
              </div>
            </div>

            {computedListing.invitees.map((invitee) => (
              <div
                key={`invitee-${invitee.inviter_id}-${invitee.name}`}
                className="py-1"
              >
                <Suspense fallback={"loading"}>
                  <Invitee
                    key={`invitee-${invitee.inviter_id}-${invitee.name}`}
                    listingId={listingId}
                    InviteeName={invitee.name}
                    InviterId={invitee.inviter_id}
                    CanRemove={
                      loggedUserIsTheOwner || invitee.inviter_id === userId
                    }
                  />
                </Suspense>
              </div>
            ))}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-gray-400">
          Redirecionando para a página de login...
        </div>
      </SignedOut>
    </main>
  );
}
