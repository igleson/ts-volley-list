import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>Criar Nova Lista</div>

      <SignedOut>
        <div className="mb-2 me-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800">
          <SignInButton>Logar</SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton></UserButton>
      </SignedIn>
    </nav>
  );
}
