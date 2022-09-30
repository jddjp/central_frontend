
import { ContentType } from "./core";

// Estructura de datos de un pedido
export interface IOrderAttributes {
    "fecha_pedido": string;
    "hora_pedido": string;
    "estatus": string;

"cliente":number,

}

export type Order = ContentType<IOrderAttributes>;

// Estructura de datos del detalle de un pedido
export interface IItemsAttributes {
    "cantidad": number;
    "pesado": number;
    "cantidad_real": number;
    "precio_venta": number;
    "pedido": number;
    "articulos": number
}

export type Item = ContentType<IItemsAttributes>;