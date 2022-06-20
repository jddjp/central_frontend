import { appAxios } from 'config/api';
import { User } from 'types/User';

export const autocompleteByName = async (config: {search: string}): Promise<User>  => {
  const { search } = config;
  const params = {
    'filters[nombre][$contains]': search
  };

  return (await appAxios.get('/users', {params})).data;
} 