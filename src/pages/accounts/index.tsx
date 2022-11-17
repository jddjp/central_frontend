import React from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { Card } from 'primereact/card';
import { useQuery } from 'react-query';
import { getDespachadores } from 'services/api/users';

export default function AccountsPage() {

  const { data: users } = useQuery(["users"], getDespachadores)
  console.log(users);

  return (
    <Box width='90%' display='flex' margin='auto'>
      <Stack spacing='3.5' direction='row'>
        {users?.map((user: any) => (
          <Card title={user.username} subTitle={user.email} style={{width: '250px'}}>
          </Card> 
        ))
        }
      </Stack>
    </Box>
  )
}