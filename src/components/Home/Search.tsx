import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";

import { useForm } from "~/hooks/useForm";

const searchSchema = z.object({
  query: z.string(),
});

export const Search: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    schema: searchSchema,
  });

  const onSubmit = handleSubmit((data) => {
    const query = data.query.trim();
    if (!query) {
      return;
    }
    void router.push(`/search?q=${encodeURIComponent(query)}`);
  });

  return (
    <section className="px-8 pb-5 pt-20 sm:px-12 md:px-24">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit} className="flex gap-4">
        <div className="relative mx-auto w-full max-w-[800px] rounded-3xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlass
              className="h-8 w-8 text-blue-500"
              aria-hidden="true"
            />
          </div>

          <input
            {...register("query")}
            type="search"
            placeholder="Search for what you want to learn"
            className="block w-full rounded-3xl border-0 bg-blue-100 px-4 py-3 pl-14 text-lg font-medium text-blue-500 placeholder:text-center placeholder:text-blue-400 md:text-2xl"
            data-cy="input-search"
          />
        </div>
      </form>
    </section>
  );
};
