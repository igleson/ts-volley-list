"use client";
import { useRouter } from "next/router";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function ListingPage({ params }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SignedIn>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          pagina para a lista {params.listingId}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-gray-400">
          Você precisa estar logado para criar listas. Clique no botão acime
          para isso.
        </div>
      </SignedOut>
    </main>
  );
}
