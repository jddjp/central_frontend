import {
  TableCellProps,
  TableRowProps,
  Td,
  Tr,
  HStack,
} from "@chakra-ui/react";
import { useSimpleTable } from "./useSimpleTable";

export interface TableItemProps<T> {
  item: T;
  cellProps?: TableCellProps;
  actions?: JSX.Element[] | JSX.Element;
  rowProps?: TableRowProps;
}

export const TableItem = <T extends unknown>(props: TableItemProps<T>) => {
  const { rowProps, cellProps, actions, item } = props;
  const table = useSimpleTable();

  return (
    <Tr {...rowProps}>
      {table.columns.map((column, index) => {
        const cell = item[column.accessor as keyof typeof item];
        const element = column.Cell?.(cell);

        return (
          <Td whiteSpace="nowrap" key={index} {...cellProps}>
            {element}
          </Td>
        );
      })}
      <Td>
        <HStack spacing="3" justifyContent="flex-end">
          {actions}
        </HStack>
      </Td>
    </Tr>
  );
};
