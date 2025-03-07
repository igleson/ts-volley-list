import { SignedIn, SignedOut } from "@clerk/nextjs";
import { type ComputedListing } from "~/models/ComputedListing";
import { Invitee, Participant } from "~/app/listings/components/Player";
import { auth } from "@clerk/nextjs/server";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;

  const { userId } = await auth();

  const computedListing: ComputedListing = {
    id: listingId,
    ownerId: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
    name: "Mockada",
    maxSize: 10,
    limitDate: new Date(2025, 4, 1),
    participants: [
      {
        id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
      },
      {
        id: "user_2u0MORnMtLfZTfro1nBm63iBG1K",
      },
    ],
    invitees: [
      {
        inviter_id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
        name: "biel",
      },
      {
        inviter_id: "user_2u0MORnMtLfZTfro1nBm63iBG1K",
        name: "adriano",
      },
    ],
    payers: [
      {
        id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
      },
      {
        inviter_id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
        name: "biel",
      },
    ],
  };

  const loggedUserIsTheOwner = userId === computedListing.ownerId;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
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
          <br />
          <h1 className="col-auto flex items-center text-2xl">
            Participantes:
          </h1>
          <br className="col-auto flex items-center" />
          {computedListing.participants.map((participant) => (
            <Participant
              key={participant.id}
              player={participant}
              canRemove={loggedUserIsTheOwner || participant.id === userId}
            ></Participant>
          ))}
          <h1 className="col-auto flex items-center text-2xl"> Convidados: </h1>
          <br className="col-auto flex items-center" />
          {computedListing.invitees.map((invitee) => (
            <Invitee
              key={`invitee-${invitee.inviter_id}`}
              player={invitee}
              canRemove={loggedUserIsTheOwner || invitee.inviter_id === userId}
            ></Invitee>
          ))}
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
