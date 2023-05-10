import axios from 'axios';
import { renameKey } from 'helpers/objects';
import { User } from 'types/User';
import { useToast } from "@chakra-ui/react";

const API_URL = process.env.REACT_APP_API_URL

const toast = useToast();
export interface AuthKey {
  username: string;
  password: string;
}

export interface UserData {
  jwt: string;
  user: User
}

export const login = async (data: AuthKey): Promise<UserData>  => {
  const payload = renameKey(data, 'username', 'identifier');
  return (await axios.post(`${API_URL}/auth/local`, payload)).data;
}

export const setDataLogin = (userId: number):void =>{
  let dateNow = new Date();
  let hora = (dateNow.getHours() < 10 ? "0" + dateNow.getHours() : dateNow.getHours()) + ":" + (dateNow.getMinutes() < 10 ? "0" + dateNow.getMinutes() : dateNow.getMinutes()) + ":" + (dateNow.getSeconds() < 10 ? "0" + dateNow.getSeconds() : dateNow.getSeconds());
  axios.post(`${API_URL}/regsitro-sesiones`,{data: { fecha_registro: dateNow.toISOString(), hora_registro:hora, user: userId }}).then(res =>{
    console.log("respuesta ",res);
  }).catch(err =>{
    toast({
      status: 'error',
      title: 'Registro de incio de sesion FALLO, comjuunequelo con el administrador del sistema',
    });
  });
}