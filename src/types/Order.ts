
import { ContentType } from "./core";

// Estructura de datos de un pedido
export interface IOrderAttributes {
    "fecha_pedido": string;
    "hora_pedido": string;
    "estatus": string;
    // unidad_de_medida: number

"cliente":number,

}

export type Order = ContentType<IOrderAttributes>;

// // Estructura de datos del detalle de un pedido
// export interface IItemsAttributes {
//     "cantidad": number;
//     "pesado": number;
//     "cantidad_real": number;
//     "precio_venta": number;
//     "pedido": number;
//     "articulos": number,
// }

// export type Item = ContentType<IItemsAttributes>;

export type Item =  {
    id: number,
    attributes: {
        cantidad: number;
        pesado: boolean;
        cantidad_real: number;
        precio_venta: number;
        pedido: number;
        articulos: number,
        unidad_de_medida: number,
        nombre_articulo: String
    }
}