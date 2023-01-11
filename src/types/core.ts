export type ContentType<T> = {id: number, attributes: T};

export type RelatedContentType<T> = {data: T};

export interface Pagination {
  page: number,
  pageSize: number,
  pageCount: number,
  total: number,
}

export interface MediaFormat {
  ext: string,
  url: string,
  hash: string,
  mime: string,
  name: string,
  path: string,
  size: number,
  width: number,
  height: number
}

export interface MediaAttributes {
  name: string,
  alternativeText: string,
  caption: string,
  width: number,
  height: number,
  formats: MediaFormat[],
  hash: string,
  ext: string,
  mime: string,
  size: number,
  url: string,
  previewUrl: string,
  provider: string,
  provider_metadata?: any,
  createdAt: string,
  updatedAt: string,
}

export type Media = ContentType<MediaAttributes>;

export interface UnidadMedidaAttributes {
  id: number,
  attributes: {
    nombre: string
  }
  // nombre: string,
  createdAt: string,
  updatedAt: string,
};

export type UnidadMedida = ContentType<UnidadMedidaAttributes>; 