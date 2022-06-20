import { createContext, useMemo } from "react";

export interface SimpleTableValue {
  columns: Column[];
}

export const SimpleTableContext = createContext<SimpleTableValue>({
  columns: [],
});

export interface Column {
  accessor: string;
  Header?: React.ReactNode;
  Cell?: (data: any) => React.ReactNode;
}

export interface SimpleTableProviderProps {
  columns: Column[];
  children: React.ReactNode;
}

export const SimpleTableProvider = (props: SimpleTableProviderProps) => {
  const { columns, children } = props;

  const value = useMemo(
    () => ({
      columns,
    }),
    [columns]
  );

  return (
    <SimpleTableContext.Provider value={value}>
      {children}
    </SimpleTableContext.Provider>
  );
};
