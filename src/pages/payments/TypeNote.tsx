import React from 'react';
import { Portal, Stack} from '@chakra-ui/react';

import { FacturaModal } from 'pages/orders/CreateOrderPage/FacturaModal';

export default function TypeNote() {
  return (
    <>
      <Stack spacing="3" alignItems='center' w="80%" mx="auto" my="5" justifyContent='center'>
        <FacturaModal />
      </Stack>
    </>
  );
}
