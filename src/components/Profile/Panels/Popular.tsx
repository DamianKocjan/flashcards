import { Tab } from "@headlessui/react";
// import { getQueryKey } from "@trpc/react-query";
import React, { useState } from "react";

import { api } from "~/utils/api";
import { Error } from "../Error";
import { PaginatedList, PaginatedListSkeleton } from "../PaginatedList";
import { type PanelProps } from "./types";
// import { useCancelQueryOnUnmount } from "./useCancelQueryOnUnmount";

export const PopularPanel: React.FC<PanelProps> = ({ userId, isSelected }) => {
  const [page, setPage] = useState(1);

  // const queryKey = getQueryKey(api.profile.popular, {
  //   userId,
  //   page,
  // });
  // useCancelQueryOnUnmount(queryKey);

  const { data, isLoading, isError, error } = api.profile.popular.useQuery(
    {
      userId,
      page,
    },
    {
      refetchOnWindowFocus: false,
      // enabled: isSelected,
    }
  );

  return (
    <Tab.Panel unmount={false}>
      {isLoading ? (
        <PaginatedListSkeleton />
      ) : isError ? (
        <Error error={error.message} />
      ) : data ? (
        <PaginatedList
          data={data.results}
          fetchNextPage={() =>
            setPage((currPage) => data.meta.next ?? currPage)
          }
          hasNextPage={data.meta.hasNext}
          fetchPreviousPage={() =>
            setPage((currPage) => data.meta.prev ?? currPage)
          }
          hasPreviousPage={data?.meta.hasPrev}
        />
      ) : null}
    </Tab.Panel>
  );
};
