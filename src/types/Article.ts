import { User } from "./User";
import { Proveedor } from "./Proveedor";
import { ContentType, Media, RelatedContentType, UnidadMedida } from "./core";

export interface ArticleAttributes {
  nombre: string;
  estado: string;
  descripcion: string;
  categoria: string;
  marca: string;
  precio_lista: number;
  codigo_barras: string;
  codigo_qr: string;
  fresh: boolean,
  inventario_fiscal: number;
  inventario_fisico: number;
  foto?: RelatedContentType<Media>;
  contador?: RelatedContentType<User>;
  proveedor?: RelatedContentType<Proveedor>;
  unidad_de_medida?: RelatedContentType<UnidadMedida>;
  historial_numeros?: RelatedContentType<Array<number>>
  createdAt: string
}

export type Article = ContentType<ArticleAttributes>;

export interface ArticlePresentationAttributes {
  peso: number;
  unidadMedia: UnidadMedida;
}

export type ArticlePresentation = ContentType<ArticlePresentationAttributes>;

export interface PriceBreakageAttributes {
  precio: number;
  descripcion_descuento: string;
  peso_inferior: number;
  peso_superior: number;
  unidadMedida: UnidadMedida;
}

export type PriceBreakage = ContentType<PriceBreakageAttributes>;

export interface PromotionAttributes {
  descripcion: string;
  fechainicio: string;
  fechafin: string;
  procedimientoaplicar: string;
  estado: string;
  articulo?: RelatedContentType<Article>;
  unidadMeida?: RelatedContentType<UnidadMedida>;
}

export type Promotion = ContentType<PromotionAttributes>;

