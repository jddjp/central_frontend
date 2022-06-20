import useLocalStorage from "hooks/useLocalStorage";
import * as React from "react";
import { UserData } from "services/api/Auth";
import { User } from "types/User";

export interface AuthContextType {
  userData: UserData | null;
  user: User | undefined;
  signin: (userData: UserData) => void;
  signout: () => void;
  isLogged: () => boolean;
}

export const AuthContext = React.createContext<AuthContextType>(null!);
export const authDataKey = 'authData';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useLocalStorage<UserData | null>(authDataKey, null);
  const user = userData?.user;

  const signin = (userData: UserData) => {
    setUserData(userData);
  };

  const signout = () => {
    setUserData(null);
  };

  const isLogged = () => userData != null;

  let value = { userData, user, signin, signout, isLogged };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}