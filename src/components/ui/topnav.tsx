import {
    RedirectToSignIn,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <UserButton showName={true} ></UserButton>
      </SignedIn>
    </nav>
  );
}
