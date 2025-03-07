import { type Invitee, type Participant } from "~/models/ComputedListing";
import { GetUserInfo } from "~/lib/UserInformation";
import Image from "next/image";

export async function Participant({
  player,
  canRemove,
}: {
  player: Participant;
  canRemove: boolean;
}) {
  const [userName, imageUrl] = await GetUserInfo(player.id);

  return (
    <div className="flex flex-auto items-center">
      <div className="col-auto flex flex-auto items-center">
        <Image
          src={imageUrl!}
          alt={userName!}
          height="50"
          width="50"
          className="flex aspect-square flex-auto items-center rounded-full object-cover"
        />
        <strong className="flex flex-auto items-center p-3">
          <i>{userName}</i>
        </strong>
      </div>
      <div className="col-auto flex flex-auto items-center">
        {canRemove && (
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-3 text-center text-white hover:bg-gradient-to-br focus:outline-none dark:focus:ring-purple-800"
          >
            Remover
          </button>
        )}
        {!canRemove && (
          <button
            type="button"
            className="cursor-not-allowed rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-3 text-center text-white opacity-50 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-purple-800"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
}

export async function Invitee({
  player,
  canRemove,
}: {
  player: Invitee;
  canRemove: boolean;
}) {
  const [inviterName, inviterImageUrl] = await GetUserInfo(player.inviter_id);

  return (
    <div className="flex flex-auto items-center">
      <div className="col-auto flex flex-auto items-center">
        <strong className="flex flex-auto items-center">
          <i>{player.name}</i>
        </strong>
        <div className="p-3"> convidado por:</div>
        <Image
          src={inviterImageUrl!}
          alt={inviterName!}
          height="50"
          width="50"
          className="flex aspect-square flex-auto items-center rounded-full object-cover"
        />
        <strong className="flex flex-auto items-center p-2">
          <i>{inviterName}</i>
        </strong>
      </div>
      <div className="col-auto flex flex-auto items-center">
        {canRemove && (
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-3 text-center text-white hover:bg-gradient-to-br focus:outline-none dark:focus:ring-purple-800"
          >
            Remover
          </button>
        )}
        {!canRemove && (
          <button
            type="button"
            className="cursor-not-allowed rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-3 text-center text-white opacity-50 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-purple-800"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
}
