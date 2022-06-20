import { Stack } from '@chakra-ui/react'
import React from 'react'

import { TypeInvoice } from 'pages/orders/CreateOrderPage/FacturaModal';

export default function TypeInvoices() {
  return (
    <>
      <Stack spacing="3" alignItems='center' w="80%" mx="auto" my="5" justifyContent='center'>
        <TypeInvoice />
      </Stack>
    </>
  )
}
