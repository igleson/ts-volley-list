import { type z, type ZodError } from "zod";
import {
  type HTMLInputTypeAttribute,
  type MutableRefObject,
  useState,
} from "react";

function validateData(
  zodType: z.ZodTypeAny,
  obj: unknown,
  callback: (hasError: boolean, error: ZodError | undefined) => void,
) {
  const validateFields = zodType.safeParse(obj);

  if (callback) callback(!validateFields.success, validateFields.error);
}

type ValidatedInputProps<T> = {
  id: string;
  type: HTMLInputTypeAttribute | undefined;
  required: boolean;
  disabled?: boolean;
  min?: number | string | undefined;
  max?: number | string | undefined;
  ref: MutableRefObject<T>;
  zodType: z.ZodTypeAny;
  defaultValue: string | undefined;
  intoType?: (inputValue: string) => T;
  fromType?: (obj: T) => string;
  onValidation?: (isValid: boolean) => void;
};

export function ValidatedInput<T extends unknown>({
  ...props
}: ValidatedInputProps<T>) {
  const [inputValid, setInputValid] = useState(true);
  const [inputError, setInputError] = useState<string | undefined>(undefined);

  return (
    <div>
      <input
        type={props.type}
        id={props.id}
        required={props.required}
        disabled={props.disabled}
        min={props.min}
        max={props.max}
        onBlur={() => {

          const value = props.intoType
            ? props.intoType(props.ref.current.value)
            : props.ref.current.value;
          validateData(props.zodType, value, (hasError, errors) => {
            setInputValid(!hasError);
            props.onValidation(!hasError);
            if (hasError && !props.disabled) {
              setInputError(errors?.issues[0]?.message);
            } else {
              setInputError(undefined);
            }
          });
        }}
        ref={props.ref}
        defaultValue={props.defaultValue}
        className={`${inputValid || props.disabled ? "" : "border border-red-500 bg-red-50 text-red-900 placeholder-red-700"} block w-full rounded-lg border border-gray-300 bg-slate-700 p-2.5 text-sm text-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
      />
      {inputError && !props.disabled ? (
        <label
          className="text-[11px] text-red-400"
          title={inputError}
        >{`${inputError.slice(0, 55)}...`}</label>
      ) : (
        <br />
      )}
    </div>
  );
}
