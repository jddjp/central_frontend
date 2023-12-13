import { ContentType, Media, RelatedContentType, UnidadMedida } from "./core";

export interface ISucursal {
  nombre?: string
}

export type Sucursal = ContentType<ISucursal>;