"use client";

import { useFieldArray, useForm } from "react-hook-form";

export interface Shareholder {
  name: string;
  email: string;
  phone: string;
  pan: string;
  shares: number;
  percentage: number;
}

interface FormData {
  shareholders: Shareholder[];
}

interface Props {
  defaultValues?: Shareholder[];
  onNext: (shareholders: Shareholder[]) => void;
  onPrevious: () => void;
}

export default function ShareholderForm({
  defaultValues = [],
  onNext,
  onPrevious,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      shareholders:
        defaultValues.length > 0
          ? defaultValues
          : [
              {
                name: "",
                email: "",
                phone: "",
                pan: "",
                shares: 0,
                percentage: 0,
              },
            ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "shareholders",
  });

  function submit(values: FormData) {
    onNext(values.shareholders);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-6"
    >
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-xl border p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Shareholder {index + 1}
            </h3>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <input
              {...register(`shareholders.${index}.name`)}
              placeholder="Name"
              className="rounded-lg border p-3"
            />

            <input
              {...register(`shareholders.${index}.email`)}
              placeholder="Email"
              className="rounded-lg border p-3"
            />

            <input
              {...register(`shareholders.${index}.phone`)}
              placeholder="Phone"
              className="rounded-lg border p-3"
            />

            <input
              {...register(`shareholders.${index}.pan`)}
              placeholder="PAN Number"
              className="rounded-lg border p-3"
            />

            <input
              type="number"
              {...register(`shareholders.${index}.shares`, {
                valueAsNumber: true,
              })}
              placeholder="Shares"
              className="rounded-lg border p-3"
            />

            <input
              type="number"
              {...register(`shareholders.${index}.percentage`, {
                valueAsNumber: true,
              })}
              placeholder="Percentage"
              className="rounded-lg border p-3"
            />

          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            name: "",
            email: "",
            phone: "",
            pan: "",
            shares: 0,
            percentage: 0,
          })
        }
        className="rounded-lg border px-5 py-3"
      >
        + Add Shareholder
      </button>

      <div className="flex justify-between">

        <button
          type="button"
          onClick={onPrevious}
          className="rounded-lg border px-6 py-3"
        >
          Previous
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Continue
        </button>

      </div>
    </form>
  );
}
