import axios from 'axios';
import { User } from 'types/User';
const API_URL = process.env.REACT_APP_API_URL

export const autocompleteByName = async (config: {search: string}): Promise<User>  => {
  const { search } = config;
  const params = {
    'filters[nombre][$contains]': search
  };

  return (await axios.get(`${API_URL}/users`, {params})).data;
}

export const getDespachadores = async () => {
  const { data } = await axios.get(`${API_URL}/users/?filters[roleCons][$contains]=Despachador`)
  return data
}
export const getPedidos = async () => {
  const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[estatus]=pendiente&populate=articulos`)
  return data
}

export const getDispatchers = async () => {
  const { data } = await axios.get(`${API_URL}/users/?populate=pedidos&filters[roleCons][$contains]=Despachador`)
  return data
}

export const getLibradores = async () => {
  const { data } = await axios.get(`${API_URL}/users/?populate=pedidos&filters[roleCons][$contains]=Librador`)
  return data
}
