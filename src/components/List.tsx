import { Flex } from "@chakra-ui/react";

export interface ListProps<T>{
  items: T[],
  onRender: (items: T[]) => JSX.Element,
  onRenderEmpty?: () => JSX.Element 
}

const defaultRenderEmpty = () => {
  return (
    <Flex
     fontSize="xl"
     fontWeight="bold"
     w="full"
     h="full"
     alignItems="center"
     justifyContent="center"
    >
      No hay elementos por mostrar
    </Flex>
  );
}

export const List = <T extends any>(props: ListProps<T>) => {
  const {
    items,
    onRender,
    onRenderEmpty = defaultRenderEmpty
  } = props;

  if(items.length === 0) {
    return onRenderEmpty();
  }

  return onRender(items);
}