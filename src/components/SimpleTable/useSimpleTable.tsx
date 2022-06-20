import { useContext } from "react";
import { SimpleTableContext } from "./SimpleTableContext";

export const useSimpleTable = () => {
  const ctx = useContext(SimpleTableContext);

  if (ctx === undefined) {
    throw new Error(
      "useSimpleTable must to be used within a SimpletableProvider"
    );
  }

  return ctx;
};
