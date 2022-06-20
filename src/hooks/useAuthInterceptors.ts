import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appAxios, authErrorInterceptor, jwtInterceptor } from 'config/api';
import { useAuth } from './useAuth';

export const useAuthInterceptors = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptorId = appAxios.interceptors.request.use((config) =>
      jwtInterceptor(config, auth.userData?.jwt)
    );

    return () => appAxios.interceptors.request.eject(interceptorId);
  }, [auth.userData?.jwt]);

  useEffect(() => {
    const interceptorId = appAxios.interceptors.response.use(
      undefined,
      (config) => authErrorInterceptor(config, () => navigate('/'))
    );

    return () => appAxios.interceptors.request.eject(interceptorId);
  }, [navigate]);
};
