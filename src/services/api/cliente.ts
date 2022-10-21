import { baseApiUrl } from 'config/api';
import { ContentType } from 'types/core';
// import { ListResponse } from './types';
import axios from 'axios'


export interface client {
  attributes: {
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
    id: number
  }
}

export type Cliente = ContentType<client>;

export const newCliente = async (payload: any) => {

  const response = await axios.post(`${baseApiUrl}clientes`, {data: payload});
  return response.data;
};

export const autocompleteByCliente = async (config: {search: string}) => {
  const { search } = config;

  const { data: response } = await axios.get(`${baseApiUrl}clientes?filters[nombre][$contains]=${search}`)
  return response.data
}
