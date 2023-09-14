import { SearchArticle } from "services/api/articles";
import { Article } from "types/Article";

declare type ShoppingCartArticle = SearchArticle;

declare interface ShoppingCartItem {
  article: Article,
  amount: number ,
  customPrice?: number,
  priceBroken?: number,
  unidad?: string
}

declare interface ShoppingCart {
  items: ShoppingCartItem[],
}

