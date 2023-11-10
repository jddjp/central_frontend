// Estructura de datos de un pedido
export type IOrderAttributes =  {
    id: number,
    attributes: {
        fecha_pedido: string;
        hora_pedido: string;
        estatus: string
        cliente:number,
        sucursal: number,
        receptor: number,
        bodega: number,
        origen:number,
        comentario: string,
        articulos: number[]
    }
}

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