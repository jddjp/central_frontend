import { ShoppingCartItem } from "../types";

export type Action = 
  | { type: 'addItem', payload: ShoppingCartItem }
  | { type: 'clear', payload: undefined | null, }
  | { type: 'removeItem', payload: ShoppingCartItem, }
  | { type: 'changeAmountItem', payload: {item: ShoppingCartItem, amount: number}};