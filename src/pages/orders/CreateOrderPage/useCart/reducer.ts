import { loadOrCreateNewCart } from "services/cart";
import { ShoppingCart, ShoppingCartItem } from "../types";
import { Action } from "./actions";


const assertNever = (x: never): never => { throw new Error(`Unexpected object ${x}`) }

export const getFinalPrice = (item: ShoppingCartItem) => {
  return (item.customPrice === undefined) 
    ? item.article.attributes.precio_lista
    : item.customPrice;
}

export const initializeReducer = (orderId?: string) => () => loadOrCreateNewCart(orderId);

export const cartReducer = (cart: ShoppingCart, action: Action): ShoppingCart => {   
  switch(action.type) {
    case 'addItem': {
      const payload = action.payload;
      const { article: newArticle, amount } = payload;
      let items = cart.items;
      let errors: string[] = [];

      // Avoid merge the same item but with different prices
      const existedItemIndex = items.findIndex(i => i.article.id === newArticle.id);
      let existedAmount = 0;

      if(existedItemIndex >= 0) {
         const existedItem = items[existedItemIndex];
         if(getFinalPrice(existedItem) !== getFinalPrice(payload)) {
          errors.push('Artículo existente con distinto precio.');
        } else {
          existedAmount = existedItem.amount;
        }

        items = [
          ...items.slice(0, existedItemIndex),
          ...items.slice(existedItemIndex + 1, -1),
        ];  
      }

      return {
        ...cart,
        items: [
          ...items,
          {
            article: newArticle,
            amount: amount + existedAmount,
            customPrice: payload.customPrice
          }
        ]
      };
    }

    case 'clear': {
      return {
        ...cart,
        items: []
      };
    }

    case 'removeItem': {
      const payload = action.payload;
      return {
        ...cart,
        items: cart.items.filter(item => item.article.id !== payload.article.id)
      }; 
    }

    case 'changeAmountItem': {
      const payload = action.payload;
      const searchedItemIndex = cart.items.findIndex(item => item.article.id === payload.item.article.id);
      if(searchedItemIndex >= 0) {
        return {
          ...cart,
          items: [
            {
              ...cart.items[searchedItemIndex],
              amount: payload.amount,
            },
            ...cart.items.slice(0, searchedItemIndex),
            ...cart.items.slice(searchedItemIndex + 1, -1),
          ]
        }
      }

      return {
        ...cart,
        items: cart.items
      }
    }

    default:
      assertNever(action);
      throw new Error('');
  }
} 