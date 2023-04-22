import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const baseMediaUrl = 'https://localhost:1337/uploads';
export const baseUrl = 'https://localhost:1337';
export const baseApiUrl = `${baseUrl}/api/`;

export const appAxios = axios.create({ baseURL: baseApiUrl });

export const jwtInterceptor = (
  config: InternalAxiosRequestConfig,
  authToken: string | undefined
) => {
  if (authToken !== undefined) {
    config.headers!['Authorization'] = `Bearer ${authToken}`;
  }

  return config;
};

export const authErrorInterceptor = (
  error: AxiosError,
  onRedirectLogin: VoidFunction
) => {
  if (error?.response?.status === 401) {
    // redirect to login
    onRedirectLogin();
  }

  return Promise.reject(error);
};
