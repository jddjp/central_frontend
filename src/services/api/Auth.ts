import axios from 'axios';
import { renameKey } from 'helpers/objects';
import { User } from 'types/User';
const API_URL = process.env.REACT_APP_API_URL


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