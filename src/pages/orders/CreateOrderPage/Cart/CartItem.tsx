import { Box, CloseButton, Flex, Input, Link, Text } from "@chakra-ui/react";
import { PriceTag } from "components/PriceTag";
import { CartProductMeta } from "./CartProductMeta";
import { getFinalPrice } from "../useCart/reducer";
import { ChangeEvent } from "react";
import { ShoppingCartItem } from "../types";
import { useQueryClient } from 'react-query'
const BASE_URL = process.env.REACT_APP_BASE_URL

type CartItemProps = {
  item: ShoppingCartItem;
  onClickDelete: VoidFunction;
  onChangeItemAmount: (amount: number) => void;
};


export const CartItem = (props: CartItemProps) => {
  
  const { item, onClickDelete, onChangeItemAmount } = props;
  const queryCache = useQueryClient()
  const query : any = queryCache.getQueryData(['stock', item.article.id])
  const { amount, customPrice } = item;
  const { descripcion, nombre, precio_lista } =
    item.article.attributes;
  const imageUrl = `${BASE_URL}${props?.item?.article?.attributes?.foto?.data?.attributes?.url}`

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeItemAmount(Number(e.target!.value));
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
    >
      <CartProductMeta
        name={nombre}
        description={descripcion}
        image={imageUrl}
      />

      {/* Desktop */}
      <Flex
        width="full"
        justify="space-between"
        display={{ base: "none", md: "flex" }}
      >
        <Box>
          <Input
            value={amount}
            min="1"
            type="number"
            display="inline"
            w="100px"
            variant="filled"
            rounded="md"
            onChange={handleChangeAmount}
          />
          <Text display="inline" ml="2">
            { query?.medida ||
              "No hay una unidad de medida disponible."}
          </Text>
        </Box>
        <PriceTag
          price={precio_lista}
          salePrice={customPrice}
          currency={"MXN"}
        />
        <CloseButton
          aria-label={`Delete ${nombre} from cart`}
          onClick={onClickDelete}
        />
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{ base: "flex", md: "none" }}
      >
        <Link fontSize="sm" textDecor="underline">
          Delete
        </Link>
        <PriceTag price={getFinalPrice(item)} currency={"MXN"} />
      </Flex>
    </Flex>
  );
};

