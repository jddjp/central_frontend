import { ContentType, Media, RelatedContentType, UnidadMedida } from "./core";

export interface ICliente {
  nombre: string,
  apellido_paterno: string,
  apellido_materno: string,
  calle: string,
  colonia: string,
  RFC: string,
  codigo_postal: string,
  correo: string,
  telefono: string,
  ciudad: string,
  estado: string,
  createdAt: string,
  updatedAt: string,
  RA: string,
  razon_social: string
}

export type Cliente = ContentType<ICliente>;
