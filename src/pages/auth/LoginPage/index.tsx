import { PhaseWindow } from 'components/PhaseWindow';
import { UsernamePhase } from './UsernamePhase';
import { PasswordPhase } from './PasswordPhase';
import { Grid } from '@chakra-ui/react';
import { useLogin } from './useLogin';
import { User } from 'types/User';

export const LoginPage = () => {
  const { 
    phase, goBackPhase, goNextPhase,
    tryLogin, setUser, user, 
  } = useLogin();

  const handleFinishUsername = (user: User) => {
    setUser(user);
    goNextPhase();
  }

  const handleFinishiPIN = (pin: string) => {
    tryLogin(user?.username!, pin);
  }

  return (
    <Grid alignItems='center' w='100vh' p="5">
      <PhaseWindow
        canGoBack={false}
        canGoNext={false}
        phase={phase}
        goNext={goNextPhase}
        goBack={goBackPhase}
      >
        <UsernamePhase
          onFinishUser={handleFinishUsername}
        />        
        <PasswordPhase
          name={user?.nombre}
          onFinish={handleFinishiPIN}
        />
      </PhaseWindow>
    </Grid>
  );
}

export default LoginPage;