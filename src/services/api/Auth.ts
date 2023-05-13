import axios from 'axios';
import { renameKey } from 'helpers/objects';
import { User } from 'types/User';

const API_URL = process.env.REACT_APP_API_URL

// const toast = useToast();
export interface AuthKey {
  username: string;
  password: string;
}

export interface UserData {
  jwt: string;
  user: User
}

export const getSesiones = async () => {
  const { data: response } = await axios.get(`${API_URL}/Regsitro-sesiones?populate=*`)
  return response.data
}

export const deleteSesiones = async (sesionData: any) => {
  const datos = sesionData;
  const { data: response } = await axios.delete(`${API_URL}/Regsitro-sesiones/${datos.sesion.id}`);
  return response.data
}

export const login = async (data: AuthKey): Promise<UserData>  => {
  const payload = renameKey(data, 'username', 'identifier');
  return (await axios.post(`${API_URL}/auth/local`, payload)).data;
}

export const setDataLogin = (userId: number):void =>{
  // const toast = useToast()

  let dateNow = new Date();
  let hora = (dateNow.getHours() < 10 ? "0" + dateNow.getHours() : dateNow.getHours()) + ":" + (dateNow.getMinutes() < 10 ? "0" + dateNow.getMinutes() : dateNow.getMinutes()) + ":" + (dateNow.getSeconds() < 10 ? "0" + dateNow.getSeconds() : dateNow.getSeconds());
  axios.post(`${API_URL}/regsitro-sesiones`,{data: { fecha_registro: dateNow.toISOString(), hora_registro:hora, user: userId }}).then(res =>{
    console.log("respuesta ",res);
  }).catch(err =>{
    // toast({
    //   title: 'An error occurred.',
    //   description: 'Unable to create user account.',
    //   status: 'error',
    //   duration: 9000,
    //   isClosable: true,
    // })
  });

  
}