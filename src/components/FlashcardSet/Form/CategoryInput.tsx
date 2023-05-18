import { Combobox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "@phosphor-icons/react";
import React, { Fragment, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  categories: { id: string; name: string }[];
};

export const CategoryInput: React.FC<Props> = ({ categories }) => {
  const { control } = useFormContext();

  const [query, setQuery] = useState("");

  /** Filter categories based on query */
  const filteredCategories = useMemo(
    () =>
      query === ""
        ? categories
        : categories.filter((category) =>
            category.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          ),
    [categories, query]
  );

  return (
    <div className="w-full">
      <Controller
        name="categoryId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Combobox value={field.value as string} onChange={field.onChange}>
            <div className="relative mt-1">
              <div className="relative w-full cursor-default overflow-hidden text-left sm:text-sm">
                <Combobox.Label className="block text-sm font-bold leading-6 text-blue-500">
                  Category
                </Combobox.Label>

                <Combobox.Input
                  className="mt-1 w-full rounded-2xl border-none bg-blue-200 px-8 py-3 pr-10 font-medium text-blue-500 shadow ring-1 ring-inset ring-blue-400 placeholder:text-blue-500 focus:outline-none focus:ring-2 focus:ring-inset sm:leading-6"
                  displayValue={(categoryId) =>
                    categories.find((c) => c.id === categoryId)?.name ?? ""
                  }
                  placeholder="Category"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute bottom-3 right-2 flex items-center justify-center pr-2">
                  <CaretDown
                    className="h-5 w-5 text-blue-500"
                    weight="bold"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute right-0 z-10 mt-2 max-h-60 w-full origin-top-right overflow-y-auto rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {filteredCategories.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-blue-500">
                      Nothing found.
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <Combobox.Option
                        key={category.id}
                        className={({ active }) =>
                          `${
                            active
                              ? "bg-blue-500 text-slate-50"
                              : "text-slate-950"
                          } group relative flex w-full items-center rounded-md px-2 py-2 pl-10 text-sm`
                        }
                        value={category}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {category.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-slate-50" : "text-blue-600"
                                }`}
                              >
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        )}
      />
    </div>
  );
};
