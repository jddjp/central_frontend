import { UnidadMedidaAttributes } from './../../types/core';
import axios from "axios";
import { Article, ArticleAttributes, PriceBreakage } from "types/Article";
import { ContentType } from "types/core";
import { WithRequired } from "types/utils";
import { ListResponse, PaginationConfig } from "./types";
import { defaultPaginationConfig } from "./utils";
import { API_URL } from '../../config/env';
import { Sucursal } from '../../types/Stock';

export type SearchArticle = ContentType<
  WithRequired<ArticleAttributes, "foto" | "unidad_de_medida">
>;


export const createSucursal = async (param: any) => {
  let data = {data : param.sucursal}
    data = (await axios.post(`${API_URL}/sucursales`, data)).data;
  return data;
}

export const getSucursal = async (suc : Number) =>{
 // const suc : Number = Number(localStorage.getItem('sucursal'));
  const { data } = await axios.get(`${API_URL}/sucursales/${suc}`)
  return data.data;
}

export const deleteSucursal = async (id: number) => {
  console.log(id)
  const data = await axios.delete(`${API_URL}/sucursales/${id}`)
  return data
}

export const getSucursales = async () =>{
  // const suc : Number = Number(localStorage.getItem('sucursal'));
   const { data } = await axios.get(`${API_URL}/sucursales`)
   return data.data;
 }

export const searchArticles = async ( name: string) => {
  const { data } = await axios.get(`${API_URL}/articulos?filters[nombre][$contains]=${name}&populate=articulos_sustitutos&populate=contador&&populate=foto&populate=historial_numeros&populate=orden_refills&populate=proveedor&populate=stocks&populate=unidad_de_medida&populate=ruptura_precio.rango_ruptura_precios`)
  return data;
};

export const searchAriclesByStock = async (sucusal : string) =>{
  const { data } = await axios.get(`${API_URL}/stocks?populate[articulo][populate]=*&filters[sucursal]=${sucusal}`)
  return data
}

export const searchAriclesByStockOnlyFiscal = async (sucusal : string, search : string) =>{
  const { data } = await axios.get(`${API_URL}/stocks?populate[articulo][populate]=*&filters[sucursal]=${sucusal}&filters[articulo][isFacturable][$eq]=true&filters[articulo][inventario_fiscal][$not]=0&filters[articulo][nombre][$contains]=${search}`)
  return data
}

export const searchArticlesByOrigen = async ( sucursal: string) => {
  const { data } = await axios.get(`${API_URL}/stocks?populate[articulo][populate]=*&filters[sucursal]=${sucursal}`)
  return data;
};

export const updateStockSucursal = async (cantidad:number,id : number) => {
  var update = {
      data: {
          cantidad: cantidad
      }
  }
  const { data } = await axios.put(`${API_URL}/stocks/${id}`, update)
  return data.data;
}

export const getStockByArticleAndSucursal = async ( sucursal: number,articulo:number) => {
  const { data } = await axios.get(`${API_URL}/stocks?filters[sucursal]=${sucursal}&filters[articulo]=${articulo}`)
  return data.data;
};
export const searchArticlesBySucursal = async (name: string, sucursalRef: number) => {
  const { data } = await axios.get(`${API_URL}/articulos?filters[nombre][$contains]=${name}&populate=ruptura_precio&populate=ruptura_precio.rango_ruptura_precios&populate=stocks.sucursal`)

  const result = data.data?.filter((product: any) => {
    const extract = product.attributes.stocks.data.map((stock : any) => stock.attributes.sucursal.data.id)
    product.attributes.stocks = extract
    var productos = []
    //console.log(productos)
    return product
  })

  return result
}

export const getArticulos = async () => {
  const { data } = await axios.get(`${API_URL}/articulos`)
  
  return data;
};

export const getArticulosNoFiscal = async () => {
  const { data } = await axios.get(`${API_URL}/articulos?filters[isFiscal][$eq]=false&populate[articulos_sustitutos][populate][0]=articulo_sustituto`)
  return data;
};

export const getArticulosSustituto = async () => {
  const { data } = await axios.get(`${API_URL}/articulos?filters[isFiscal][$eq]=true`)
  
  return data.data;
};
export const getArticulosSustituto_especifico = async (id: any) => {
  const { data } = await axios.get(`${API_URL}/ArticulosSustitutos?filters[articulo]=${id}&populate=*`)
  return data;
};

export const updateArticulosSustituto = async (payload: { articulo_sustituto: number, articulo: number}) => {
  const { data } = await axios.post(`${API_URL}/articulosSustitutos`, { data: payload })

  return data
};

export const deleteArticulosSustituto = async (payload: number) => {
  const { data } = await axios.delete(`${API_URL}/articulosSustitutos/${payload}`)

  return data
};

export const listArticles = async (
  options: PaginationConfig = defaultPaginationConfig,
) => {
  let queryParams: Record<string, any> = {
    populate: "foto,unidad_de_medida",
    "pagination[page]": options.page,
  };

  const response: ListResponse<SearchArticle> = (
    await axios.get(`${API_URL}/articulos`, { params: queryParams })
  ).data;

  //const { data }  = await axios.get(`${API_URL}/stocks?populate[articulo][populate]=*&filters[sucursal]=${4}`)
 // console.log(data.data)

  //console.log(response.data)
  return response;
};


export const listArticlesBySucursal = async (
  sucusar:Number
) => {
  const { data }  = await axios.get(`${API_URL}/stocks?populate[articulo][populate]=*&filters[sucursal]=${sucusar}`)
  return data.data;
};



export const getArticlePrices = async (
  article: Article
  ): Promise<ListResponse<PriceBreakage>> => {
  return (await axios.get(`${API_URL}/rupturaprecios?filters[articulo]=${article.id}`)).data;
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
