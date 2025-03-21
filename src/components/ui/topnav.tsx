import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import { MyLists } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";

export async function TopNav() {
  const { userId } = await auth();

  const [myLists, participatingListings] = await MyLists(userId!);

  return (
    <nav className="fixed top-0 flex h-16 max-h-16 w-full items-center justify-between border-b bg-purple-950 p-4 text-xl font-semibold">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-auto justify-start">
          <UserButton showName={true} />
        </div>
        <div className="flex justify-end">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>Listas</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-56  bg-gradient-to-br from-purple-950 to-purple-700 text-white">
                <DropdownMenuLabel>Minhas listas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {myLists!.map((listing) => (
                    <DropdownMenuItem key={listing.id}>
                      <Link
                        className="flex flex-auto text-xs truncate max-w-xs"
                        href={`/listings/${listing.id}`}
                      >
                        {listing.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  Listas que sou participante
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {participatingListings!.map((listing) => (
                    <DropdownMenuItem key={listing.id}>
                      <Link
                        className="flex flex-auto text-xs"
                        href={`/listings/${listing.id}`}
                      >
                        {listing.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SignedIn>
    </nav>
  );
}
