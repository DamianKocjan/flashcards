import { CaretDown, MagnifyingGlass, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";

import {
  FlashcardSet,
  FlashcardSetSkeleton,
} from "~/components/shared/layout/FlashcardSet";
import { useForm } from "~/hooks/useForm";
import { api } from "~/utils/api";

const searchSchema = z.object({
  query: z.string(),
});

const Search: React.FC = () => {
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="flex gap-4">
      <div className="relative mx-auto w-full max-w-[800px] rounded-3xl shadow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlass
            className="h-8 w-8 text-blue-400"
            aria-hidden="true"
          />
        </div>

        <input
          {...register("query")}
          type="search"
          placeholder="Search for what you want to learn"
          className="block w-full rounded-3xl border-0 bg-slate-50 px-4 py-3 pl-14 text-lg font-medium text-blue-500 placeholder:text-center placeholder:text-blue-400 md:text-2xl"
          data-cy="input-search"
        />
      </div>
    </form>
  );
};

const Popular: React.FC = () => {
  const { data, isLoading, isError, error } = api.flashcard.popular.useQuery(
    {
      limit: 6,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <FlashcardSetSkeleton key={i} />
        ))}
      </>
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-[10rem] w-full max-w-[800px] items-center justify-center rounded-3xl border border-red-500 bg-slate-50 shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">
            <Warning className="mr-4 inline-block h-8 w-8" aria-hidden="true" />
            Error loading popular flashcard sets
          </h2>
          <p className="text-red-400">{error?.message}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {data.map((flashcardSet) => (
        <FlashcardSet key={flashcardSet.id} {...flashcardSet} />
      ))}
    </>
  );
};

export const Learn: React.FC = () => {
  return (
    <section className="bg-blue-400 px-8 pb-8 pt-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl">
        <Search />

        <div className="mt-14 flex flex-wrap justify-center gap-14">
          <Popular />
        </div>

        <div className="mt-10 flex flex-col items-center text-slate-50">
          <Link href="/search" className="peer text-2xl font-bold">
            Find more
          </Link>
          <CaretDown
            className="h-8 w-8 -translate-y-1 transition-transform peer-hover:translate-y-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};
