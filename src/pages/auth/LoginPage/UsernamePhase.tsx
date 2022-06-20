import { Button, Center, Heading, Stack, StackProps, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { User } from "types/User";
import { AutocompleteUsername } from './AutocompleteUsername';


export interface UsernamePhaseProps extends StackProps {
  onFinishUser: (user: User) => void,
}

export const UsernamePhase = (props: UsernamePhaseProps) => {
  const { onFinishUser, ...rest } = props;
  const [user, setUser] = useState<User|null>(null);

  const handleSubmit = () => {
    onFinishUser(user!);
  }

  return (
    <Stack {...rest} spacing="6">
      <Center>
        <Stack>
          <Heading>¡Excelente día!</Heading>
          <Text>Ingresa tu nombre completo</Text>
        </Stack>
      </Center>
      <Center>
        <Stack w={{base: "80%", xl: '600px' }} spacing="3" as='form'> 
          <AutocompleteUsername 
            user={user}
            setUser={setUser}
          />
          <Button
            disabled={user === null}
            type='submit' onClick={handleSubmit}
          >
            Continuar
          </Button>          
        </Stack>
      </Center>
    </Stack>
  );
}