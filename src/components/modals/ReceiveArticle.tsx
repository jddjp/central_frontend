import { useState, ChangeEvent } from 'react'
import { Box, Button, Input, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { Dialog } from "primereact/dialog";
import { RiCheckLine, RiBookmark2Fill } from 'react-icons/ri'
import { QueryClient, useMutation } from 'react-query';
import { postHistorialPayload } from 'services/api/products';
import moment from 'moment';

interface PropsReceiveArticle {
  headerTitle: String | undefined,
  isVisible: boolean,
  idProduct: number | undefined,
  historial: any

  onHandleHide: () => void,
  onHandleAgree?: () => void
}

const RecieveArticle = (props: PropsReceiveArticle) => {

  const [historial, setHistorial] = useState('')
  const queryClient = new QueryClient()

  const { mutate } = useMutation(() => postHistorialPayload(historial, props.idProduct), {
    onSuccess: () => {
      setHistorial('')
      queryClient.invalidateQueries(['products'])
      props.onHandleHide()
    }
  })

  const onHandleItem = (e: number) => {
    if (historial) {
      setHistorial(historial.concat(`, ${e}`))
    } else {
      setHistorial(historial.concat(`${e}`))
    }
  }

  const closeDialog = () => {
    setHistorial('')
    props.onHandleHide()
  }

  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHistorial(e.target.value)
  }

  console.log(historial);

  const deleteProductDialogFooter = (
    <Box>
      <Box display='flex' justifyContent='center' w='100%' py='4'>
        {
          [1,2,3,4,5,6,7,8,9].map((num: number) => (
            <Button colorScheme='gray' variant='outline' onClick={() => onHandleItem(num)}>{num}</Button>
          ))
        }
      </Box>
      <Button leftIcon={<RiCheckLine/>} colorScheme='blue' variant='solid' onClick={() => mutate()}>
        Ingresar
      </Button>
    </Box>
  );

  return ( 
    <Dialog style={{ width: '600px' }} header={props.headerTitle} modal 
    footer={deleteProductDialogFooter} 
    onHide={closeDialog}
    visible={props.isVisible}>
      <Input value={historial} fontWeight='bold' borderRadius='5px' onChange={onHandleChange} variant='filled'/>
      <List spacing={3} mt='2' py='3' height='11rem' overflowY='scroll'>
        {props.historial?.map((item: any) => (
            <ListItem display='flex' alignItems='center'  fontWeight='bold'>
              <ListIcon as={RiBookmark2Fill} fontSize='25'/>
              <Box>
                <Text>{item.attributes.array_numeros}</Text>
                <Text fontSize='13' fontWeight='medium'>{moment(item.attributes.createdAt).format('L, h:mm:ss a')}</Text>
              </Box>
            </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default RecieveArticle;