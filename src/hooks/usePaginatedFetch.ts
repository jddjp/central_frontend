import { useCallback, useEffect, useState } from "react";
import { useIsMounted } from "./useIsMounted";

export const usePaginatedFetch = <T, E = string>(
  asyncFunction: (page: number) => Promise<T>,
  immediate = true,
  initialPage?: number
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [page, setPage] = useState(initialPage ?? 1);
  const isMounted = useIsMounted();

  const goNextPage = useCallback(() => setPage((p) => p + 1), [setPage]);

  const execute = useCallback(() => {
    setStatus("pending");
    setValue(null);
    setError(null);
    return asyncFunction(page)
      .then((response: any) => {
        if (isMounted()) {
          setValue(response);
          setStatus("success");
        }
      })
      .catch((error: any) => {
        if (isMounted()) {
          setError(error);
          setStatus("error");
        }
      });
  }, [asyncFunction, page, isMounted]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, status, value, error, page, goPage: setPage, goNextPage };
};
