import {
    RedirectToSignIn,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full bg-purple-950 items-center justify-between border-b  p-4 text-xl font-semibold h-16 max-h-16 fixed top-0">
      <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <UserButton showName={true} ></UserButton>
      </SignedIn>
    </nav>
  );
}
