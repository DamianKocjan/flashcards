import React, { forwardRef, useId } from "react";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "ref" | "className"
> & {
  label: string;
};
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      <label
        className="block text-sm font-bold leading-6 text-blue-500"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          className="block w-full rounded-2xl border-0 bg-blue-200 px-8 py-3 font-medium text-blue-500 ring-1 ring-inset ring-blue-400 placeholder:text-blue-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          id={id}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
});
