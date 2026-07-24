"use client";

import { useFieldArray, useForm } from "react-hook-form";

export interface Director {
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  din?: string;
  designation: string;
}

interface FormData {
  directors: Director[];
}

interface Props {
  defaultValues?: Director[];
  onNext: (directors: Director[]) => void;
  onPrevious: () => void;
}

export default function DirectorForm({
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
      directors:
        defaultValues.length > 0
          ? defaultValues
          : [
              {
                name: "",
                email: "",
                phone: "",
                pan: "",
                aadhaar: "",
                din: "",
                designation: "Director",
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
    name: "directors",
  });

  function submit(values: FormData) {
    onNext(values.directors);
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Director {index + 1}
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
              {...register(
                `directors.${index}.name`
              )}
              placeholder="Director Name"
              className="rounded-lg border p-3"
            />

            <input
              {...register(
                `directors.${index}.email`
              )}
              placeholder="Email"
              className="rounded-lg border p-3"
            />

            <input
              {...register(
                `directors.${index}.phone`
              )}
              placeholder="Phone"
              className="rounded-lg border p-3"
            />

            <input
              {...register(
                `directors.${index}.pan`
              )}
              placeholder="PAN"
              className="rounded-lg border p-3"
            />

            <input
              {...register(
                `directors.${index}.aadhaar`
              )}
              placeholder="Aadhaar"
              className="rounded-lg border p-3"
            />

            <input
              {...register(
                `directors.${index}.din`
              )}
              placeholder="DIN"
              className="rounded-lg border p-3"
            />

            <input
              {...register(
                `directors.${index}.designation`
              )}
              placeholder="Designation"
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
            aadhaar: "",
            din: "",
            designation: "Director",
          })
        }
        className="rounded-lg border px-5 py-3"
      >
        + Add Director
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
