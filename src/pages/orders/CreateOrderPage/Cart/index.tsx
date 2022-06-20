import { BoxProps, Text, Stack } from '@chakra-ui/react';
import { List } from 'components/List';
import { ShoppingCart, ShoppingCartItem } from '../types';
import { CartItem } from './CartItem';
import { CartBody } from './Layout';


export interface ShoppingCartProps extends BoxProps {
  onOpenConfirmationClear: VoidFunction,
  cart: ShoppingCart,
  onRemoveItem: (item: ShoppingCartItem) => void,
  onChangeItemAmount: (data: {item: ShoppingCartItem, amount: number}) => void,
}

export const Cart = (props: ShoppingCartProps) => {
  const { onOpenConfirmationClear, cart, onRemoveItem, onChangeItemAmount, ...rest } = props;

  const handleRemoveItem = (item: ShoppingCartItem) => () => onRemoveItem(item);
  const handleChangeItemAmount = (item: ShoppingCartItem) => (amount: number) => onChangeItemAmount({item, amount});

  return (
    <Stack {...rest}>
      <Text fontWeight="bold" fontSize="xl" mb={1}>Orden</Text>
      <CartBody position='relative' height='full' pt='50px'>
        <List
          items={cart.items}
          onRender={
            (items) =>
              <>
                {items.map(item => 
                  <CartItem
                    key={item.article.id}
                    item={item}
                    onClickDelete={handleRemoveItem(item)}
                    onChangeItemAmount={handleChangeItemAmount(item)}
                  />
                )}
              </>
          }
        />
      </CartBody>
    </Stack>
  )
}