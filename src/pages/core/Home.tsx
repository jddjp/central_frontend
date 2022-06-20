import { Center, Heading, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Option } from 'components/Option';
import { Menu } from 'components/Menu';

export const HomePage = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => navigate('/login');

  const roles = [
    'Supervisor',
    'Cajero',
    'Vendedor',
    'Despachador',
    'Librador',
    'Receptor',
    'Contador'
  ];

  return (
    <VStack marginX="auto" maxW="xl" mt={12} spacing={8}>
      <Center>
        <Heading textAlign='center'>Bienvenido a Comercializadora San José</Heading>
      </Center>

      <Menu w="full">
        {roles.map(
          (role) =>
            <Option key={role} onClick={redirectToLogin}>{role}</Option>
        )}
      </Menu>
    </VStack>
  );
}