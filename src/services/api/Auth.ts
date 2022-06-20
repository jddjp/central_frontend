import { appAxios } from 'config/api';
import { renameKey } from 'helpers/objects';
import { User } from 'types/User';

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
  return (await appAxios.post('/auth/local', payload)).data;
}