import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SignedIn>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          pagina para a mostrar a lista {listingId}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-gray-400">
          Você precisa estar logado para criar ou visualizar listas. Clique no botão acima para isso.
        </div>
      </SignedOut>
    </main>
  );
}
