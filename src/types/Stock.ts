export interface Sucursal {
    data?: {
        id?: number;
        attributes?: {
            nombre?: string| null;
            calle?: string | null;
            colonia?: string | null;
            numero_exterior?: string | null;
            numero_interior?: string | null;
            codigo_postal?: string | null;
            municipio?: string | null;
            estado?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
        } ;
    };
}

export interface UnidadDeMedida {
    data?: {
        id: number;
        attributes: {
            nombre: string;
            createdAt: string;
            updatedAt: string;
        };
    };
}

export interface Articulo {
    data?: {
        id: number;
        attributes: {
            nombre: string;
            estado: string;
            descripcion: string;
            categoria: string;
            marca: string;
            precio_lista: number;
            codigo_barras: string;
            codigo_qr: string;
            inventario_fiscal: number;
            inventario_fisico: number;
            createdAt: string;
            updatedAt: string;
            fresh: boolean;
            foto: {
                data: {
                    id: number;
                    attributes: {
                        name: string;
                        alternativeText: string | null;
                        caption: string | null;
                        width: number;
                        height: number;
                        formats: {
                            large: {
                                ext: string;
                                url: string;
                                hash: string;
                                mime: string;
                                name: string;
                                path: string | null;
                                size: number;
                                width: number;
                                height: number;
                            };
                            small: {
                                ext: string;
                                url: string;
                                hash: string;
                                mime: string;
                                name: string;
                                path: string | null;
                                size: number;
                                width: number;
                                height: number;
                            };
                            medium: {
                                ext: string;
                                url: string;
                                hash: string;
                                mime: string;
                                name: string;
                                path: string | null;
                                size: number;
                                width: number;
                                height: number;
                            };
                            thumbnail: {
                                ext: string;
                                url: string;
                                hash: string;
                                mime: string;
                                name: string;
                                path: string | null;
                                size: number;
                                width: number;
                                height: number;
                            };
                            hash: string;
                            ext: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl: string | null;
                            provider: string;
                            provider_metadata: string | null;
                            createdAt: string;
                            updatedAt: string;
                        };
                    };
                };
            };
        };
    };
}

export interface Stock {

    attributes?: {
        cantidad?: number;
        createdAt?: string;
        updatedAt?: string;
        sucursal?: Sucursal;
        unidad_de_medida?: UnidadDeMedida;
        articulo?: Articulo;
    },
    id?: number
}

