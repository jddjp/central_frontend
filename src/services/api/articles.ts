import { UnidadMedidaAttributes } from './../../types/core';
import axios from "axios";
import { Article, ArticleAttributes, PriceBreakage } from "types/Article";
import { ContentType } from "types/core";
import { WithRequired } from "types/utils";
import { ListResponse, PaginationConfig } from "./types";
import { buildFilter, defaultPaginationConfig } from "./utils";
const API_URL = 'http://54.165.25.186:1380/api'

export type SearchArticle = ContentType<
  WithRequired<ArticleAttributes, "foto" | "unidad_de_medida">
>;

export const searchArticles = async ( name: string) => {
  const { data } = await axios.get(`${API_URL}/articulos?filters[nombre][$contains]=${name}&populate=foto`)
  
  return data;
};
export const getArticulos = async () => {
  const { data } = await axios.get(`${API_URL}/articulos`)
  
  return data;
};
export const getArticulosPopulate = async () => {
  const { data } = await axios.get(`${API_URL}/articulos?populate=*`)
  
  return data;
};
export const getArticulosSustituto = async () => {
  const { data } = await axios.get(`${API_URL}/ArticulosSustitutos?populate=*`)
  
  return data;
};
export const updateArticulosSustituto = async (payload: any) => {
  console.log(payload);
  axios
  .put(`${API_URL}/articulos/${payload.update.data.dataArticulo.id}`, {
      data:{
        articulos_sustituto:
          [
           {id:payload.articulo.data.id} 
          ]
      } 
  })
  .then(response => {
    console.log(response);
  });
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
  // response.data = response.data.map(fixArticleMediaUrls);

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

export const getUnidades = async () => {
  const { data } = await axios.get(`${API_URL}/unidadmedidas`)

  return data.data.map((unidad: UnidadMedidaAttributes) => {
    return {
      value: unidad.id,
      name: unidad.attributes.nombre
    }
  })
}
