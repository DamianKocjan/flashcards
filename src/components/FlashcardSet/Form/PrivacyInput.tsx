import { Listbox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "@phosphor-icons/react";
import React, { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";

const PRIVACY_OPTIONS = [
  { id: "PUBLIC", name: "Public" },
  { id: "PRIVATE", name: "Private" },
  { id: "UNLISTED", name: "Unlisted" },
];

export const PrivacyInput: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="relative">
      <Controller
        name="privacy"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Listbox value={field.value as string} onChange={field.onChange}>
            <Listbox.Button className="flex items-center rounded-2xl border border-blue-500 bg-blue-200 px-4 py-3 text-center text-lg font-bold text-blue-500 md:px-8 md:py-5 md:text-xl">
              {field.value}
              <CaretDown
                className="-mr-1 ml-2 inline-block h-5 w-5"
                weight="bold"
              />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {PRIVACY_OPTIONS.map((option) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `${
                        active ? "bg-blue-500 text-slate-50" : "text-slate-950"
                      } group relative flex w-full items-center rounded-md px-2 py-2 pl-10 text-sm`
                    }
                    key={option.id}
                    value={option.id}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.name}
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
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        )}
      />
    </div>
  );
};
