import { SearchArticle } from "services/api/articles";

declare type ShoppingCartArticle = SearchArticle;

declare interface ShoppingCartItem {
  article: ShoppingCartArticle,
  amount: number ,
  customPrice?: number,
}

declare interface ShoppingCart {
  items: ShoppingCartItem[],
}

