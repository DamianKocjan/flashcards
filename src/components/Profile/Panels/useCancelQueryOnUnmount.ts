import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useEffect } from "react";

/** Cancels query on unmount of component */
export function useCancelQueryOnUnmount(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      void queryClient.cancelQueries(queryKey);
    };
  }, [queryClient, queryKey]);
}
