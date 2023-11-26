import { ShoppingCart } from "pages/orders/CreateOrderPage/types";
import { saveObj, loadObj } from "./localstorage";

const keyNameSpace = 'shoppingCart-';

const resolveKey = (cartId: string) => keyNameSpace + cartId;

const generateCartId = (cart: ShoppingCart) => {
  return '1';
  // const clientName = cart.client.name?.trim();
  // if(clientName === undefined || clientName.length === 0) {
  //   return new Date().toUTCString();
  // }
  
  // return clientName;
}

export const saveCart = (cart: ShoppingCart) => {
  const finalKey = generateCartId(cart);
  saveObj(finalKey, cart);
}

export const loadCart = (idCart: string) => {
  const finalKey = resolveKey(idCart);
  return loadObj<ShoppingCart>(finalKey)
}

export const emptyCart: ShoppingCart = {
    items: [],
    id_pedido: 0
}

export const loadOrCreateNewCart = (id: string | undefined) => {
  if(id === undefined) {
    return emptyCart;
  }

  try {
    return loadCart(id);
  } catch(e) {
    return emptyCart;
  }
}
