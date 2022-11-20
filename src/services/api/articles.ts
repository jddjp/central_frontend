import axios from "axios";
import { Article, ArticleAttributes, PriceBreakage } from "types/Article";
import { ContentType } from "types/core";
import { WithRequired } from "types/utils";
import { ListResponse, PaginationConfig } from "./types";
import { buildFilter, defaultPaginationConfig } from "./utils";
const API_URL = process.env.REACT_APP_API_URL
const BASE_URL = process.env.REACT_APP_BASE_URL


export type SearchArticle = ContentType<
  WithRequired<ArticleAttributes, "foto" | "unidad_de_medida">
>;

const fixArticleMediaUrls = <
  T extends ContentType<WithRequired<ArticleAttributes, "foto">>
>(
  article: T
) => {
  
  article.attributes.foto.data.attributes.url =
    `${BASE_URL}${article.attributes.foto.data.attributes.url}`;

  return article;
};

export const searchArticles = async (
  name: string
): Promise<ListResponse<SearchArticle>> => {
  let queryParams: Record<string, any> = {
     populate: "foto,unidad_de_medida",
    "filters[nombre][$contains]": name,
  };

  const response: ListResponse<SearchArticle> = (
    await axios.get(`${API_URL}/articulos`, { params: queryParams })
  ).data;
  response.data = response.data.map(fixArticleMediaUrls);
console.log("=============>")
  console.log(  response.data)
  return response;
};

export const listArticles = async (
  options: PaginationConfig = defaultPaginationConfig
): Promise<ListResponse<SearchArticle>> => {
  let queryParams: Record<string, any> = {
    populate: "foto,unidad_de_medida",
    "pagination[page]": options.page,
  };

  const response: ListResponse<SearchArticle> = (
    await axios.get(`${API_URL}/articulos`, { params: queryParams })
  ).data;
  response.data = response.data.map(fixArticleMediaUrls);

  return response;
};

export const getArticlePrices = async (
  article: Article
): Promise<ListResponse<PriceBreakage>> => {
  const queryParams = {
    [buildFilter(["article", "id"], "eq")]: article.id,
  };

  return (await axios.get(`${API_URL}/rupturaprecios`, { params: queryParams })).data;
};

