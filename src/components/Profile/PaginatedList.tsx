import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import React from "react";

import {
  FlashcardSet,
  FlashcardSetSkeleton,
} from "~/components/shared/layout/FlashcardSet";

type Props = {
  data: React.ComponentProps<typeof FlashcardSet>[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  hasPreviousPage: boolean;
  fetchPreviousPage: () => void;
};

export const PaginatedList: React.FC<Props> = ({
  data,
  hasNextPage,
  fetchNextPage,
  hasPreviousPage,
  fetchPreviousPage,
}) => {
  if (!data.length) {
    return (
      <div>
        <h3
          className="text-2xl font-semibold text-slate-50"
          data-cy="empty-list-info"
        >
          No flashcard sets found.
        </h3>
      </div>
    );
  }
  return (
    <div className="flex items-center">
      <button
        onClick={fetchPreviousPage}
        disabled={hasPreviousPage}
        className="p-1"
        data-cy="previous-page"
      >
        <CaretLeft className="h-8 w-8 text-slate-50" aria-hidden="true" />
      </button>

      <div className="flex w-full gap-4">
        {data?.map((set) => (
          <FlashcardSet key={set.id} {...set} />
        ))}
      </div>

      <button
        onClick={fetchNextPage}
        disabled={hasNextPage}
        className="p-1"
        data-cy="next-page"
      >
        <CaretRight className="h-8 w-8 text-slate-50" aria-hidden="true" />
      </button>
    </div>
  );
};

export const PaginatedListSkeleton: React.FC = () => {
  return (
    <div className="flex items-center">
      <button disabled className="p-1" data-cy="previous-page">
        <CaretLeft className="h-8 w-8 text-slate-50" aria-hidden="true" />
      </button>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <FlashcardSetSkeleton key={i} />
        ))}
      </div>

      <button disabled className="p-1" data-cy="next-page">
        <CaretRight className="h-8 w-8 text-slate-50" aria-hidden="true" />
      </button>
    </div>
  );
};
