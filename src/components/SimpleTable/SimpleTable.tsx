import { Table, Tbody, Th, Thead, Tr, TableProps } from "@chakra-ui/react";
import { SimpleTableProvider } from "./SimpleTableContext";
import { Column } from "./SimpleTableContext";

export interface SimpleTableProps extends TableProps {
  columns: Column[];
}

export const SimpleTable = (props: SimpleTableProps) => {
  const { children, columns, ...rest } = props;

  return (
    <SimpleTableProvider columns={columns}>
      <Table my="8" borderWidth="1px" fontSize="sm" {...rest}>
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th whiteSpace="nowrap" scope="col" key={index}>
                {column.Header}
              </Th>
            ))}
            <Th />
          </Tr>
        </Thead>
        <Tbody>{children}</Tbody>
      </Table>
    </SimpleTableProvider>
  );
};
