import {
  HStack,
  Input,
  Stack,
  StackProps,
  InputGroup,
  FormControl,
  InputLeftElement,
  FormLabel,
} from "@chakra-ui/react";
import { formatHour } from "helpers/format";
import { IconAction } from "components/IconAction";
import { ClearIcon, EditIcon, SearchIcon } from "components/icons";
import { columns } from "./config";
import { SimpleTable, TableItem } from "components/SimpleTable";

export const SearchBar = (props: StackProps) => {
  return <HStack {...props} />;
};

const orders = [
  { client: "Daniel Sanchez Order", hour: formatHour(new Date()) },
  { client: "Order Daniel Martinez ", hour: formatHour(new Date()) },
  { client: "Dianae Manchez", hour: formatHour(new Date()) },
  { client: "Roberto Sanchez", hour: formatHour(new Date()) },
  { client: "Gilberto Hernandez", hour: formatHour(new Date()) },
];

export const SearchInput = () => {
  return (
    <FormControl minW={{ md: "320px" }} id="search" colorScheme="brand">
      <InputGroup size="sm">
        <FormLabel srOnly>Filter por nombre de cliente</FormLabel>

        <InputLeftElement pointerEvents="none" color="gray.400">
          <SearchIcon />
        </InputLeftElement>
        <Input
          rounded="base"
          type="search"
          placeholder="Filtrar por nombre de cliente..."
        />
      </InputGroup>
    </FormControl>
  );
};

export const SalesHistoryPage = (props: StackProps) => {
  return (
    <Stack w="80%" mx="auto" mt="10" spacing="5" {...props}>
      <SearchInput />

      <SimpleTable columns={columns}>
        {orders.map((o) => (
          <TableItem
            key={o.client}
            item={o}
            actions={[
              <IconAction
                key={0}
                size="sm"
                aria-label="Editar"
                icon={<EditIcon />}
              />,
              <IconAction
                key={1}
                size="sm"
                variant="outline"
                aria-label="Eliminar"
                icon={<ClearIcon />}
              />,
            ]}
          />
        ))}
      </SimpleTable>
    </Stack>
  );
};
