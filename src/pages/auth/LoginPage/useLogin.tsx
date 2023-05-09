import { useCounter, useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useAuth } from "hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setDataLogin } from "services/api/Auth";
import { SERVER_ERROR_MESSAGE } from "services/api/errors";
import { User } from "types/User";

export const useLogin = () => {
  const { 
    increment,
    decrement,
    valueAsNumber: phase,
  } = useCounter({min:0, max: 1, step: 1, defaultValue: 0});
  const { signin } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = localStorage.getItem('role')
  const navigate = useNavigate();
  const toast = useToast();

  const goNextPhase = () => increment(1)
  const goBackPhase = () => decrement(1);

  const tryLogin = async (username: string, password: string) => {
    setIsSubmitting(true);

    try {
      const userData = (await login({username, password}));
      if (userData.user.roleCons === 'Supervisor' || userData.user.roleCons === role) {
        signin(userData);
        toast({
          status: 'success',
          title: 'Autenticación extiosa.',
        });
        setDataLogin(userData.user.id);
        navigate('/login/welcomen');
      } else if (userData.user.roleCons !== role) {
        toast({
          title: `¡El ${userData.user.roleCons.toLowerCase()} no puede acceder a la zona del ${role?.toLowerCase()}!`,
          status: 'error',
          duration: 3000,
        })
        localStorage.removeItem('role')
        navigate('/')
      }
      console.log(userData);
    } catch(e) {
      const error = e as AxiosError;
      setUser(null);
      goBackPhase();

      if(error?.response?.status === 400) {
        toast({
          status: 'error',
          title: 'Autenticación fallida.',
          description: 'PIN incorrecto',
        });
      } else {
        toast({
          status: 'error',
          title: 'Error inesperado',
          description: SERVER_ERROR_MESSAGE,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    goBackPhase,
    goNextPhase,
    phase,
    tryLogin,
    user, setUser,
    isSubmitting,
    setIsSubmitting
  };
}