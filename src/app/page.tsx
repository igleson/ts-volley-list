"use client";

import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CreateListing } from "~/server/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loadingSpinner";

export default function HomePage() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [listingName, setListingName] = useState("");
  const [maxSize, setMaxSize] = useState(0);
  const [limitDate, setLimitDate] = useState(new Date(2025, 3));

  const SaveListing = () => {
    setIsSaving(true);
    toast("criando lista");
    void CreateListing({ listingName, maxSize, limitDate })
      .then((listings) => {
        if (listings.length == 1) {
          toast("lista criada");
          router.push(`listings/${listings[0]!.Id}`);
        } else if (listings.length == 0) {
          toast("lista não pôde ser criada");
          throw new Error("Listing not created");
        } else {
          toast("lista não pôde ser criada");
          throw new Error("More than one listing created");
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SignedIn>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="text-4xl text-gray-200"> Criar Lista</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-auto flex items-center">
              <label
                htmlFor="list-name-input"
                className="mb-2 block text-sm font-medium text-slate-200 dark:text-white"
              >
                Nome da lista:
              </label>
            </div>
            <div className="col-auto">
              <input
                type="text"
                id="list-name-input"
                required
                aria-describedby="helper-text-explanation"
                value={listingName}
                className="block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) => setListingName(e.target.value)}
              />
            </div>
            <div className="col-auto flex items-center">
              <label
                htmlFor="max-number-input"
                className="mb-2 block text-sm font-medium text-slate-200 dark:text-white"
              >
                Número máximo de jogadores da lista:
              </label>
            </div>
            <div className="col-auto">
              <input
                type="number"
                id="max-number-input"
                value={maxSize}
                aria-describedby="helper-text-explanation"
                className="block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) => setMaxSize(Number(e.target.value))}
              />
            </div>
            <div className="col-auto flex items-center">
              <label
                htmlFor="limit-datetime-input"
                className="mb-2 block text-sm font-medium text-slate-200 dark:text-white"
              >
                Data Limite para retirar o nome e não pagar:
              </label>
            </div>
            <div className="col-auto">
              <input
                type="datetime-local"
                id="limit-datetime-input"
                className="block w-full rounded-lg border border-white bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) => setLimitDate(new Date(e.target.value))}
              />
            </div>
          </div>
          {!isSaving && (
            <button
              type="button"
              className="mb-2 me-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
              onClick={SaveListing}
              disabled={isSaving}
            >
              Criar lista
            </button>
          )}
          {isSaving && <LoadingSpinner />}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-slate-200">
          Você precisa estar logado para criar listas. Clique no botão acime
          para isso.
        </div>
      </SignedOut>
    </main>
  );
}
