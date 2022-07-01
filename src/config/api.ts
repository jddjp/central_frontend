import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const baseMediaUrl = 'http://localhost:1337';
export const baseUrl = 'http://localhost:1337';
export const baseApiUrl = `${baseUrl}/api/`;

export const appAxios = axios.create({ baseURL: baseApiUrl });

export const jwtInterceptor = (
  config: AxiosRequestConfig,
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
