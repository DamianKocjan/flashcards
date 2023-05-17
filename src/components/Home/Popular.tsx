import { Warning } from "@phosphor-icons/react";
import React from "react";

import { api } from "~/utils/api";
import {
  FlashcardSet,
  FlashcardSetSkeleton,
} from "../shared/layout/FlashcardSet";

export const Popular: React.FC = () => {
  const { data, isLoading, isError, error } = api.flashcard.popular.useQuery(
    {
      limit: 6,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="px-8 py-6 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-medium text-blue-500">
          Popular Flashcards
        </h2>

        <div
          className="flex flex-wrap justify-center gap-14 py-8"
          data-cy="container-popular"
        >
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <FlashcardSetSkeleton key={i} />
              ))}
            </>
          ) : isError ? (
            <div className="flex min-h-[10rem] w-full max-w-[800px] items-center justify-center rounded-3xl border border-red-500 bg-slate-50 shadow">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500">
                  <Warning
                    className="mr-4 inline-block h-8 w-8"
                    aria-hidden="true"
                  />
                  Error loading categories
                </h2>
                <p className="text-red-400">{error?.message}</p>
              </div>
            </div>
          ) : (
            <>
              {data.map((flashcard) => (
                <FlashcardSet {...flashcard} key={flashcard.id} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
