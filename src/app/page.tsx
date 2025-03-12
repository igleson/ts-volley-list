"use client";

import { useRef, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CreateListing } from "~/server/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loadingSpinner";
import { type ErrorMapCtx, z, ZodError } from "zod";
import * as moment from 'moment';

z.setErrorMap((issue: z.ZodIssueOptionalMessage, ctx: ErrorMapCtx) => {
    if (issue.code === z.ZodIssueCode.invalid_date) {
        return { message: "Data inválida" };
    }
    return { message: ctx.defaultError };
});

const listingNameSchema = z
    .string()
    .nonempty({ message: "Nome é obrigatório" })
    .min(5, { message: "Nome da lista deve conter no mínimo 5 caracteres" })
    .trim();
const maxSizeSchema = z
    .number()
    .min(2, { message: "Tamanho máximo não pode ser menor do que 2" })
    .max(25, { message: "Tamanho máximo não pode ser maior do que 25" });
const limitDateSchema = z
    .date()
    .min(new Date(), { message: "Data limite não pode estar no passado" });

export default function HomePage() {
    const router = useRouter();

    const [listNameValid, setListNameValid] = useState(true);
    const [maxSizeValid, setMaxSizeValid] = useState(true);
    const [limitDateValid, setLimitDateValid] = useState(true);


    const listingNameRef = useRef<string>("Nova lista");
    const maxSizeRef = useRef<number>(12);
    const limitDateRef = useRef<string>(null);
    const [hasLimitDate, setHasLimitDate] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    function validateFormData(
        zodType: z.ZodTypeAny,
        obj: unknown,
        callback: (hasError: boolean, error: ZodError | undefined) => void,
    ) {
        const validateFields = zodType.safeParse(obj);

        if (callback) callback(validateFields.success, validateFields.error);
        console.log(validateFields.error);
    }

    const SaveListing = () => {
        setIsSaving(true);
        toast("criando lista");
        void CreateListing({
            listingName: listingNameRef.current.value,
            maxSize: maxSizeRef.current.value,
            limitDate: limitDateRef.current
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
                            <input
                                type="text"
                                id="list-name-input"
                                required
                                aria-describedby="helper-text-explanation"
                                onBlur={() =>
                                    validateFormData(
                                        listingNameSchema,
                                        listingNameRef.current.value,
                                        (hasError, errors) => {
                                            setListNameValid(hasError);
                                        },
                                    )
                                }
                                ref={listingNameRef}
                                defaultValue="Nova lista"
                                className={`${listNameValid ? "" : "bg-red-50 border border-red-500 text-red-900 placeholder-red-700"} block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
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
                                required={true}
                                onBlur={() =>
                                    validateFormData(
                                        maxSizeSchema,
                                        Number(maxSizeRef.current.value),
                                        (hasError, errors) => {
                                            setMaxSizeValid(hasError);
                                        },
                                    )
                                }
                                ref={maxSizeRef}
                                min={2}
                                max={50}
                                defaultValue={12}
                                aria-describedby="helper-text-explanation"
                                className={`${maxSizeValid ? "" : "bg-red-50 border border-red-500 text-red-900 placeholder-red-700"}  block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
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
                                onChange={(_) => {
                                    setHasLimitDate(prev => {
                                        if (prev) setLimitDateValid(true);
                                        return !prev;
                                    });
                                }
                                }
                                type="checkbox"
                                className="h-4 w-4 rounded-lg border-gray-300 bg-slate-700 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <input
                                type="datetime-local"
                                id="limit-datetime-input"
                                ref={limitDateRef}
                                min={(moment(new Date())).format('YYYY-MM-DDTHH:mm')}
                                defaultValue={(moment(new Date(new Date().getTime() + (1000 * 60 * 60 * 24)))).format('YYYY-MM-DDTHH:mm')}
                                onBlur={() =>
                                    validateFormData(
                                        limitDateSchema,
                                        new Date(limitDateRef.current.value),
                                        (hasError, errors) => {
                                            setLimitDateValid(hasError);
                                        },
                                    )
                                }
                                disabled={!hasLimitDate}
                                className={`${limitDateValid ? "" : "bg-red-50 border border-red-500 text-red-900 placeholder-red-700"}  block w-full rounded-lg border border-white bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                            />
                        </div>
                    </div>
                    {!isSaving && (
                        <button
                            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                            onClick={SaveListing}
                            disabled={!listNameValid || !maxSizeValid || !limitDateValid || isSaving}
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
