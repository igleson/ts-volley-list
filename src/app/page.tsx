"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { type ErrorMapCtx, z } from "zod";
import moment from "moment";
import { type AnyFieldMeta, useForm } from "@tanstack/react-form";
import { CreateListing } from "~/server/queries";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loadingSpinner";
import { useTransition } from "react";
import ListingLoading from "~/app/listings/[listingId]/listingLoading";

z.setErrorMap((issue: z.ZodIssueOptionalMessage, ctx: ErrorMapCtx) => {
  if (issue.code === z.ZodIssueCode.invalid_date) {
    return { message: "Data inválida" };
  }
  return { message: ctx.defaultError };
});

const listingNameSchema = z
  .string()
  .nonempty({
    message: "Nome é obrigatório",
  })
  .min(5, { message: "Nome deve conter no mínimo 5 caracteres" })
  .trim();
const maxSizeSchema = z
  .number()
  .min(2, { message: "2 é o número mínimo de jogadores" })
  .max(25, { message: "25 é o número máximo de jogadores" });
const limitDateSchema = z
  .date()
  .min(new Date(), { message: "Data limite não pode estar no passado" });

const CreateListingSchema = z
  .object({
    ListingName: listingNameSchema,
    MaxSize: maxSizeSchema,
    HasLimitDate: z.literal(false),
    LimitDate: z.date().nullable(),
  })
  .or(
    z.object({
      ListingName: listingNameSchema,
      MaxSize: maxSizeSchema,
      HasLimitDate: z.literal(true),
      LimitDate: limitDateSchema,
    }),
  );

type CreateListingOptions = z.infer<typeof CreateListingSchema>;

export default function ClientOnlyHomePage() {
  const minDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      ListingName: "Nova lista",
      MaxSize: 10,
      HasLimitDate: false,
      LimitDate: minDate,
    } as CreateListingOptions,
    validators: {
      onChange: CreateListingSchema,
    },
    onSubmit: async (formData) => {
      const listings = await CreateListing({
        listingName: formData.value.ListingName,
        maxSize: formData.value.MaxSize,
        limitDate: formData.value.HasLimitDate
          ? formData.value.LimitDate
          : null,
      });
      if (listings && listings[0]) {
        toast("lista criada");
        startTransition(() => router.push(`listings/${listings[0]!.Id}`));
      } else if (listings && listings.length > 1) {
        toast("lista não pôde ser criada");
        throw new Error("More than one listing created");
      } else {
        toast("lista não pôde ser criada");
        throw new Error("Listing not created");
      }
    },
  });

  const router = useRouter();

  if (isTransitioning) return <ListingLoading />;

  return (
    <main className="flex min-h-screen w-[80%] min-w-[450px] max-w-[600px] flex-col items-center justify-center p-3 text-white">
      <SignedIn>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <div className="text-4xl text-gray-200"> Criar Lista</div>
            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="ListingName"
                children={(field) => (
                  <>
                    <div className="col-auto flex items-center">
                      <label
                        htmlFor="list-name-input"
                        className="mb-2 block text-sm font-medium text-slate-200 dark:text-white"
                      >
                        Nome da lista:
                      </label>
                    </div>

                    <div className="col-auto">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          id="list-name-input"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`${field.state.meta.errors.length == 0 ? "" : "border border-red-500 bg-red-50 text-red-900 placeholder-red-700"} block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                        />
                        <FieldIError fieldMeta={field.state.meta} />
                      </div>
                    </div>
                  </>
                )}
              ></form.Field>

              <form.Field
                name="MaxSize"
                children={(field) => (
                  <>
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
                        min={maxSizeSchema.minValue!}
                        max={maxSizeSchema.maxValue!}
                        required={true}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value.trim() === ""
                              ? 0
                              : e.target.valueAsNumber,
                          )
                        }
                        className={`${field.state.meta.errors.length == 0 ? "" : "border border-red-500 bg-red-50 text-red-900 placeholder-red-700"} block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                      />
                      <FieldIError fieldMeta={field.state.meta} />
                    </div>
                  </>
                )}
              ></form.Field>

              <div className="col-auto flex items-center">
                <label
                  htmlFor="limit-datetime-input"
                  className="mb-2 block text-sm font-medium text-slate-200 dark:text-white"
                >
                  Data Limite para retirar o nome e não pagar:
                </label>
              </div>
              <div className="col-auto flex items-center gap-0">
                <form.Field
                  name="HasLimitDate"
                  children={(field) => (
                    <input
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      type="checkbox"
                      className="h-4 w-4 rounded-lg border-slate-900 bg-slate-700 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    />
                  )}
                ></form.Field>
                <form.Subscribe
                  selector={(state) => state.values.HasLimitDate}
                  children={(hasLimitDate) => (
                    <form.Field
                      name="LimitDate"
                      children={(field) => (
                        <div>
                          <input
                            type="datetime-local"
                            id="limit-datetime-input"
                            min={moment(limitDateSchema.minDate).format(
                              "YYYY-MM-DDTHH:mm",
                            )}
                            disabled={!hasLimitDate}
                            onChange={(e) => {
                              try {
                                field.handleChange(new Date(e.target.value));
                              } catch (e) {
                                field.handleChange(limitDateSchema.minDate);
                              }
                            }}
                            value={moment(field.state.value).format(
                              "YYYY-MM-DDTHH:mm",
                            )}
                            className={`${!hasLimitDate || field.state.meta.errors.length == 0 ? "" : "border border-red-500 bg-red-50 text-red-900 placeholder-red-700"} block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                          />
                          <FieldIError
                            fieldMeta={field.state.meta}
                            enabled={hasLimitDate}
                          />
                        </div>
                      )}
                    ></form.Field>
                  )}
                ></form.Subscribe>
              </div>
            </div>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isSubmitSuccessful,
              ]}
              children={([canSubmit, isSubmitting, isSubmitSuccessful]) => (
                <>
                  {isSubmitSuccessful || isSubmitting ? (
                    <LoadingSpinner />
                  ) : (
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                      disabled={!canSubmit}
                    >
                      Criar lista
                    </button>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </SignedIn>
      <SignedOut>
        <div className="text-2xl text-slate-200">
          Redirecionando para a página de login...
        </div>
      </SignedOut>
    </main>
  );
}

function FieldIError({
  fieldMeta,
  enabled = true,
}: {
  fieldMeta: AnyFieldMeta | undefined;
  enabled?: boolean;
}) {
  const error =
    enabled && fieldMeta?.isTouched && fieldMeta?.errors && fieldMeta.errors[0]
      ? fieldMeta.errors.map((e) => e.message).join(", ")
      : undefined;

  return (
    <div className="relative min-h-[20px]">
      {error ? (
        <span
          className="absolute left-0 right-0 cursor-help truncate text-[12px] text-red-300"
          title={error}
        >
          {error}
        </span>
      ) : (
        <span className="invisible absolute left-0 right-0 truncate">
          placeholder
        </span>
      )}
    </div>
  );
}
