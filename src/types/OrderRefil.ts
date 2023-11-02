import { ContentType } from "./core";

export interface OrderRefillAttributes {
    cantidad: number,
    createdAt?: string,
    created__by?: number,
    articulo: number

}

export type OrderRefill = ContentType<OrderRefillAttributes>;

export type Proveedor = ContentType<OrderRefillAttributes>;