'use client'

import { useRef, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CreateListing } from "~/server/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loadingSpinner";
import { type ErrorMapCtx, z } from "zod";
import moment from "moment";
import { ValidatedInput } from "~/components/ui/ValidatedInput";

z.setErrorMap((issue: z.ZodIssueOptionalMessage, ctx: ErrorMapCtx) => {
  if (issue.code === z.ZodIssueCode.invalid_date) {
    return { message: "Data inválida" };
  }
  return { message: ctx.defaultError };
});

const listingNameSchema = z
  .string()
  .nonempty({ message: "Nome é obrigatório" })
  .min(5, { message: "Nome deve conter no mínimo 5 caracteres" })
  .trim();
const maxSizeSchema = z
  .number()
  .min(2, { message: "Tamanho não pode ser menor do que 2" })
  .max(25, { message: "Tamanho não pode ser maior do que 25" });
const limitDateSchema = z
  .date()
  .min(new Date(), { message: "Data limite não pode estar no passado" });

export default function HomePage() {
  const minDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
  const router = useRouter();

  const listingNameRef = useRef<string>("Nova lista");
  const maxSizeRef = useRef<number>(12);
  const limitDateRef = useRef<Date>(minDate);
  const [hasLimitDate, setHasLimitDate] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isMaxValueValid, setIsMaxValueValid] = useState<boolean>(true);
  const [isDateValid, setIsDateValid] = useState<boolean>(true);

  const SaveListing = () => {
    setIsSaving(true);
    toast("criando lista");
    void CreateListing({
      listingName: listingNameRef.current.value,
      maxSize: maxSizeRef.current.value,
      limitDate: hasLimitDate
        ? new Date(limitDateRef.current.value)
        : null,
    })
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
              <ValidatedInput
                type="text"
                id="list-name-input"
                required={true}
                ref={listingNameRef}
                defaultValue="Nova lista"
                zodType={listingNameSchema}
                onValidation={setIsNameValid}
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
              <ValidatedInput
                type="number"
                id="max-number-input"
                min={2}
                max={25}
                required={true}
                ref={maxSizeRef}
                defaultValue="12"
                zodType={maxSizeSchema}
                intoType={Number}
                onValidation={setIsMaxValueValid}
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
            <div className="col-auto flex items-center gap-0">
              <input
                checked={hasLimitDate}
                onChange={(_) => setHasLimitDate(!hasLimitDate)}
                type="checkbox"
                className="h-4 w-4 rounded-lg border-gray-300 bg-slate-700 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <ValidatedInput<Date>
                type="datetime-local"
                id="limit-datetime-input"
                required={hasLimitDate}
                disabled={!hasLimitDate}
                ref={limitDateRef}
                min={moment(minDate).format("YYYY-MM-DDTHH:mm")}
                defaultValue={moment(minDate).format("YYYY-MM-DDTHH:mm")}
                zodType={limitDateSchema}
                intoType={(str) => new Date(str)}
                onValidation={setIsDateValid}
              />
            </div>
          </div>
          {!isSaving && (
            <button
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
              onClick={SaveListing}
              disabled={
                isSaving || !isNameValid || !isMaxValueValid || !isDateValid
              }
            >
              Criar lista
            </button>
          )}
          {isSaving && <LoadingSpinner />}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-slate-200">
          Você precisa estar logado para criar listas. Clique no botão acima para isso.
        </div>
      </SignedOut>
    </main>
  );
}
