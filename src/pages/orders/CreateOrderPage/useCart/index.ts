import { useReducer } from "react"
import { emptyCart } from "services/cart";
import { ShoppingCartItem } from "../types";
import { initializeReducer, cartReducer } from "./reducer";

export interface usePurchaseOrderConfig {
  id?: string,
}

export const useCart = (config: usePurchaseOrderConfig = {}) => {
  const { id } = config;
  const [cart, dispatch] = useReducer(cartReducer, emptyCart, initializeReducer(id));

  const addItem = (item: ShoppingCartItem) => dispatch({type: 'addItem', payload: item});
  const removeItem = (item: ShoppingCartItem) => dispatch({type: 'removeItem', payload: item});
  const clear = () => dispatch({type: 'clear', payload: undefined});
  const changeItemAmount = (data: {item: ShoppingCartItem, amount: number}) => dispatch({type: 'changeAmountItem', payload: data})
  const total  = cart.items.reduce((a, i) => a + i.article.attributes.precio_lista * i.amount, 0);

  return {
    cart,
    total,
    addItem,
    removeItem,
    clear,
    changeItemAmount,
  };
}