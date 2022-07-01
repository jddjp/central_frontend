import { appAxios } from 'config/api';
import { ListResponse } from './types';


export interface client {
  RFC: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  calle: string;
  colonia: string;
  correo: string;
  codigo_postal: string;
  telefono: string;
  ciudad: string;
  estado: string;
}

export const newCliente = async (payload: client) => {
  let data = {
    data: { ...payload },
  };

  const response = await appAxios.post('/clientes', data);
  return response.data;
};

export const autocompleteByCliente = async (config: {
  search: string;
}): Promise<ListResponse<client>> => {
  const { search } = config;
  // console.log(search);
  const queryParams = {
    'filters[nombre][$contains]': search,
  };
  const response = (await appAxios.get(`/clientes`, { params: queryParams }))
    .data;
  console.log('hola', response.data);
  return response.data;
};
