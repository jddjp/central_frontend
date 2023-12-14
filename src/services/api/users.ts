import axios from 'axios';
import { User } from 'types/User';
import { API_URL } from '../../config/env';

export const getUsuarios = async () => {
  const { data } = await axios.get(`${API_URL}/users`)
  return data
}

export const autocompleteByName = async (config: {search: string}): Promise<User[]>  => {
  const { search } = config;
  const params = {
    'filters[nombre][$contains]': search.length > 2 ? search : '' 
  };

  return (await axios.get(`${API_URL}/users`, {params})).data;
}

export const autocompleteByReceptores = async () => {
  const { data } = await axios.get(`${API_URL}/users/?filters[roleCons][$contains]=Receptor`)
  return data
}

export const getDespachadores = async () => {
  const { data } = await axios.get(`${API_URL}/users/?filters[roleCons][$contains]=Despachador`)
  return data
}

// export const getPedidos = async () => {
//   const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[estatus]=pendiente&populate=articulos`)
//   return data
// }

export const getDispatchers = async () => {
  const { data } = await axios.get(`${API_URL}/users/?populate=pedidos&filters[roleCons][$contains]=Despachador`)
  return data
}

export const getLibradores = async () => {
  const { data } = await axios.get(`${API_URL}/users/?populate=pedidos&filters[roleCons][$contains]=Librador`)
  return data
}

export const createUser = async (params: any) => {
  console.log(params)
  let data = {data : params.usuario}
  data = (await axios.post(`${API_URL}/users`, data)).data;
  return data;
};

export const updateUser = async (params: any) => {
 let data = {data : params.usuario}
 data = (await axios.put(`${API_URL}/users/${params.cliente.referenceId}`, data)).data;
 return data;
};

export const deleteUser = async (id: number) => {
  const data = await axios.delete(`${API_URL}/users/${id}`)
  return data
}

export const getUser = async (id : Number) =>{
  const { data } = await axios.get(`${API_URL}/users/${id}`)
  return data.data;
}