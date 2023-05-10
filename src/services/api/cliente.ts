import axios from 'axios'
import { ContentType } from 'types/core';
const API_URL = process.env.REACT_APP_API_URL

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
  const response = await axios.post(`${API_URL}/clientes`, {data: payload});
  return response.data;
};

export const autocompleteByCliente = async (config: {search: string}) => {
  const { search } = config;

  const { data: response } = await axios.get(`${API_URL}/clientes?filters[nombre][$contains]=${search}`)
  return response.data
}

export const getClients = async () => {
  const { data: response } = await axios.get(`${API_URL}/clientes`)
  return response.data
}
