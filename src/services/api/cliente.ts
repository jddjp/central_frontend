import axios from 'axios'
import { API_URL } from '../../config/env';
import {Cliente} from 'types/Cliente'

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


export const newCliente = async (payload: any) => {
  const response = await axios.post(`${API_URL}/clientes`, {data: payload});
  return response.data;
};

export const createCliente = async (params: any) => {
  let data = {data : params.cliente}
  data = (await axios.post(`${API_URL}/clientes`, data)).data;
  return data;
};

export const updateCliente = async (params: any) => {
 let data = {data : params.cliente}
 data = (await axios.put(`${API_URL}/clientes/${params.cliente.referenceId}`, data)).data;
 return data;
};
export const deleteCliente = async (id: number) => {
  const data = await axios.delete(`${API_URL}/clientes/${id}`)
  return data
}

export const autocompleteByCliente = async (config: {search: string}) => {
  const { search } = config;

  const { data: response } = await axios.get(`${API_URL}/clientes?filters[nombre][$contains]=${search}`)
  return response.data
}

export const getClients = async () => {
  const { data: response } = await axios.get(`${API_URL}/clientes`)
  return response.data
}

export const getCliente = async (id : Number) =>{
   const { data } = await axios.get(`${API_URL}/clientes/${id}`)
   return data.data;
 }

export const getClient = async (id: number) : Promise<Cliente> => {
  const { data: response } = await axios.get(`${API_URL}/clientes/${id}`)
  return Promise.resolve(response.data)
}
