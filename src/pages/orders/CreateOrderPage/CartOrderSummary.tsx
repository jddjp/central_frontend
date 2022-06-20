import * as React from 'react'
import {
  Flex,
  Heading,
  Stack,
  StackProps,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import { formatPrice } from 'helpers/format'
import { ShoppingCart } from './types'


export type OrderSummaryItemProps = {
  label: string
  value?: string
  children?: React.ReactNode
}

export const OrderSummaryItem = (props: OrderSummaryItemProps) => {
  const { label, value, children } = props

  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
}


export interface CartOrderSummaryProps extends StackProps {
  cart: ShoppingCart,
  total: number,
}

export const CartOrderSummary = (props: CartOrderSummaryProps) => {
  const { children, cart, total, ...rest } = props;

  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" {...rest}>
      <Heading size="md">Resumen de orden</Heading>
      <OrderSummaryItem label="Total de artículos">
        {cart.items.length}
      </OrderSummaryItem>

      <OrderSummaryItem label="Artículos modificados">
        {cart.items.filter(i => i.customPrice !== undefined).length}
      </OrderSummaryItem>

      <Flex justify="space-between">
        <Text fontSize="lg" fontWeight="semibold">
          Total
        </Text>
        <Text fontSize="xl" fontWeight="extrabold">
          {formatPrice(total)}
        </Text>
      </Flex>

      <Stack spacing="6">
        {children}
      </Stack>
    </Stack>
  );
}