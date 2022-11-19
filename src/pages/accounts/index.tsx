import React from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { Card } from 'primereact/card';
import { useQuery } from 'react-query';
import { getDespachadores } from 'services/api/users';

export default function AccountsPage() {

  const { data: users } = useQuery(["users"], getDespachadores)

  return (
    <Box width='90%' display='flex' margin='auto'>
      <Stack spacing='3.5' direction='row' wrap='wrap'>
        {users?.map((user: any) => (
          <Card title={user.username} subTitle={user.email} footer={user.roleCons} style={{width: '250px', marginTop: '1.25em'}}>
          </Card> 
        ))
        }
      </Stack>
    </Box>
  )
}