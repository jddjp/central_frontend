import { useContext } from 'react';

import { AuthContext } from 'providers/AuthProvider';

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if(ctx === undefined) {
    throw new Error('useAuth must to be inside a AuthProvider');
  }

  return ctx;
}