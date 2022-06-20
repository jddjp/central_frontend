import { Box, Button, Text, VStack } from '@chakra-ui/react'

import { useAuth } from 'hooks/useAuth';
import { fullName } from 'types/User';
import { CardWithAvatar } from 'components/CardWithAvatar'
import { formatHour } from 'helpers/format';
import { useNavigate } from 'react-router-dom';

const WelcomenPage = () =>{
  const navigate = useNavigate();
  const auth = useAuth();
  const now = new Date();

  const handleContinue = () => {
    navigate('/dashboard');
  }

  return (
    <VStack marginY="auto" marginX="auto" maxW="xl" spacing={8}>
      <CardWithAvatar
        w="full"
        bg='brand.500'
        avatarProps={{
          backgroundColor: 'brand.600',
        }}
        mb={5}
      >
        <VStack color="white" fontSize={30} spacing={10} alignItems="center" pt={5}>
          <Box>
            <Text textAlign="center" fontWeight="bold">¡Bienvenido!</Text>
            <Text textAlign="center" fontWeight="bold">{fullName(auth.user!)}</Text>              
          </Box>

          <Box>
            <Text textAlign="center" fontWeight="bold">Hora de entrada:</Text>
            <Text textAlign="center" fontWeight="bold">{formatHour(now)}</Text>
          </Box>
        </VStack>
      </CardWithAvatar>

      <Button 
        onClick={handleContinue}
        colorScheme="brand"
        size="lg">
        Continuar
      </Button>
    </VStack>
  );
}

export default WelcomenPage;