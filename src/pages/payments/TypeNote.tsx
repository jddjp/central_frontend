import React from 'react';
import { Portal, Stack} from '@chakra-ui/react';
import {useLocation} from 'react-router-dom';

import { FacturaModal } from 'pages/orders/CreateOrderPage/FacturaModal';

export default function TypeNote() {
  const location = useLocation();
  console.log("location:");
  console.log(location);
  
  return (
    <>
      <Stack spacing="3" alignItems='center' w="80%" mx="auto" my="5" justifyContent='center'>
        
        <FacturaModal cart={location.state}/>
      </Stack>
    </>
  );
}
