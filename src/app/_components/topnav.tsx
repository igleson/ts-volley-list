import {SignedIn, SignedOut, SignInButton, SignOutButton} from "@clerk/nextjs";

export function TopNav() {
    return (
        <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
            <div>Criar Nova Lista</div>
            <div className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 rounded-lg px-5 py-2.5 text-center me-2 mb-2">
                <SignedOut>
                    <SignInButton>Logar</SignInButton>
                </SignedOut>
                <SignedIn>
                    <SignOutButton>Sair</SignOutButton>
                </SignedIn>
            </div>
        </nav>
    );
}