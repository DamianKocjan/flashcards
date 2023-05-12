import { Warning } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

import { api } from "~/utils/api";

export const Categories: React.FC = () => {
  const { data, isLoading, isError, error } = api.flashcard.categories.useQuery(
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
        <h2 className="text-2xl font-medium text-blue-500">Categories</h2>

        <div className="mt-7 flex flex-wrap items-stretch justify-evenly gap-x-8 gap-y-7">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full max-w-xs rounded-3xl bg-blue-100 px-16 py-3 text-center text-xl font-medium text-blue-500 shadow"
                >
                  Loading...
                </div>
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
              {data.map(({ id, name }) => (
                <Link
                  href={`/search?category=${id}`}
                  key={id}
                  className="w-full max-w-xs rounded-3xl bg-blue-500 px-16 py-3 text-center text-xl font-medium text-slate-50 shadow"
                >
                  {name}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
