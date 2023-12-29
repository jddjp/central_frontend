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
  if(params.usuario.fecha_nacimiento == ""){
   params.usuario.fecha_nacimiento = null;
  }
  if(params.usuario.fecha_contrato == ""){
   params.usuario.fecha_contrato = null;
  }
  if(params.usuario.fecha_termino == ""){
   params.usuario.fecha_termino = null;
  }
  let data = params.usuario;
  /*{
    "username": "testt",
    "email": "test22@gmail.com",
    "confirmed": true,
    "nombre": "Mario",
    "apellido_paterno": "test",
    "apellido_materno": "test",
    "sexo": "masculino",
    "CURP": null,
    "telefono": null,
    "estatus_marital": null,
    "fecha_nacimiento": null,
    "fecha_contrato": null,
    "fecha_termino": null,
    "roleCons": "Supervisor",
    "password": "123456"
  }*/
  data = (await axios.post(`${API_URL}/users`, data)).data;
  return data;
};

export const updateUser = async (params: any) => {
 let data = params.usuario;
 if(params.usuario.password == ""){
  delete params.usuario.password;
 }
 if(params.usuario.fecha_nacimiento == ""){
  params.usuario.fecha_nacimiento = null;
 }
 if(params.usuario.fecha_contrato == ""){
  params.usuario.fecha_contrato = null;
 }
 if(params.usuario.fecha_termino == ""){
  params.usuario.fecha_termino = null;
 }
 data = (await axios.put(`${API_URL}/users/${params.id}`, data)).data;
 return data;
};

export const deleteUser = async (id: number) => {
  const data = await axios.delete(`${API_URL}/users/${id}`)
  return data
}

export const getUser = async (id : Number) =>{
  const { data } = await axios.get(`${API_URL}/users/${id}`);
  console.log("----data");
  
  console.log(data);
  
  return data;
}