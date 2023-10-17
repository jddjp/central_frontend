import { Box, Button, Text, VStack, useToast } from '@chakra-ui/react'

import { useAuth } from 'hooks/useAuth';
import { fullName } from 'types/User';
import { CardWithAvatar } from 'components/CardWithAvatar'
import { formatHour } from 'helpers/format';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getSubsidiaries } from 'services/api/subsidiary';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

const WelcomenPage = () =>{

  const navigate = useNavigate();
  const toast = useToast()
  const [sucursal, setSucursal] = useState('')
  const auth = useAuth();
  const now = new Date();

  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries)

  const handleContinue = () => {
    if (!sucursal) {
      toast({
        title: 'seleccion una sucursal',
        status: 'warning'
      })
      return;
    }

    localStorage.setItem('sucursal', JSON.stringify(sucursal))
    setSucursal('')
    navigate('/dashboard');
  }

  console.log(sucursal);

  return (
    <VStack marginY="auto" marginX="auto" maxW="xl" spacing={4}>
      <CardWithAvatar
        w="full"
        bg='brand.500'
        avatarProps={{
          backgroundColor: 'brand.600',
        }}
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

      <Box display='flex' gap='0.5rem' width='100%' flexDirection='column'>
        <label htmlFor="name">Sucursal</label>
        <Dropdown style={{width: '100%'}} placeholder='Ingresa una sucursal' value={sucursal} inputId="dropdown" options={subsidiaries?.map((subsiduary: any) => {
            return {
              name: subsiduary.attributes.nombre,
              value: subsiduary.id
            }
          })} 
          onChange={(e) => setSucursal(e.target.value)} optionLabel="name" required
        />
      </Box>

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