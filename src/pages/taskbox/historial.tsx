import { Box, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { Dialog } from "primereact/dialog";
import { RiBookmark2Fill } from 'react-icons/ri'
import moment from 'moment';

interface PropsReceiveArticle {
  historial: any
  headerTitle: String | undefined,
  isVisible: boolean,
  idProduct: number | undefined,
  children?: JSX.Element,
  toogle?: string
  pedido?: any
  onHandleHide: () => void,
  onHandleAgree?: () => void
}

const Historial = (props: PropsReceiveArticle) => {
  var historialApi : any[] = []
  if(props.historial != undefined){
    props.historial.forEach((orden: any) => {
      historialApi.push(orden)
    });
  }
  var size = 0;
  if(historialApi != undefined){
    size = historialApi.length * 4
    if(size > 30){
      size = 30
    } 
  }
  
  const closeDialog = () => {
    props.onHandleHide()
  }
  return (
    <Dialog style={{ width: '600px' }} header={`Historial de articulos recibidos`} modal  
      onHide={closeDialog}
      visible={props.isVisible}>
      <List spacing={3} mt='2' py='3' height={`${size}rem`} overflowY='scroll'>
        {historialApi?.map((item: any) => (
          <ListItem display='flex' alignItems='center' fontWeight='bold' key={item.id}>
            <ListIcon as={RiBookmark2Fill} fontSize='25' />
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

export default Historial;







