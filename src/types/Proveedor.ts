import { ContentType } from "./core";

export interface ProveedorAttributes {
  nombre: string,
  apellido_paterno: string,
  apellido_materno: string,
  telefono: string,
  email: string,
  RFC: string,
  calle: string,
  colonia: string,
  codigo_postal: number,
}

export type Proveedor = ContentType<ProveedorAttributes>;