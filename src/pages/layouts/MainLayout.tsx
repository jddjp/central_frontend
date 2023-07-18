import { ReactNode } from 'react';

import { Box, Text, HStack, Flex, Avatar } from '@chakra-ui/react';
import { useAuth } from 'hooks/useAuth';
import '../../global.css'
interface MainLayoutProps {
  children: ReactNode
}

const AuthNavBar = () => {
  const auth = useAuth();
  
  const handleLogout = () => {
    auth.signout();
  }

  return (
    <Flex 
      bg="brand.500"
      color="white"
      w="full"
      alignItems="center"
      justify="space-between"
      p={3}
      h="50px"
      className='nota-digital'
    >
      <HStack spacing={1}>
        <Text>Bienvenido</Text><Text fontWeight="bold">{auth!.user!.nombre}</Text>
      </HStack>

      <Box>
        <Text style={{cursor: 'pointer'}} onClick={handleLogout}>Cerrar sesión</Text>
      </Box>
    </Flex>
  );
}

const Footer = () => {
  return (
    <Flex justifyContent="center" w="full" p={3}>
      <Avatar
        bg="brand.500"
        borderWidth="6px"
        size="xl"
      />
    </Flex>
  );
}

export const MainLayout = (props: MainLayoutProps) => {
  const auth = useAuth();
  const isLogged = auth.isLogged();
  const { children } = props;
  
  return (
    <Box>
      <Flex minH="100vh" direction="column" >
        {isLogged && <AuthNavBar />}
        <Flex flex='1'>
          {children}
        </Flex>
        <Footer />
      </Flex>
    </Box>
  );
};