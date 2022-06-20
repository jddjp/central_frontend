import { useCallback, useEffect, useState } from "react";
import { useIsMounted } from "./useIsMounted";

export const useAsync = <T, E = string>(
    asyncFunction: () => Promise<T>,
    immediate = true
  ) => {
    const [status, setStatus] = useState<
      "idle" | "pending" | "success" | "error"
    >("idle");
    const [value, setValue] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);
    const isMounted = useIsMounted();

    const execute = useCallback(() => {
      setStatus("pending");
      setValue(null);
      setError(null);
      return asyncFunction()
        .then((response: any) => {
          if(isMounted()) {
              setValue(response);
              setStatus("success");                
          }
        })
        .catch((error: any) => {
          if(isMounted()) {
              setError(error);
              setStatus("error");
          }
        });
    }, [asyncFunction, isMounted]);

    useEffect(() => {
      if (immediate) {
        execute();
      }
    }, [execute, immediate]);
    return { execute, status, value, error };
  };