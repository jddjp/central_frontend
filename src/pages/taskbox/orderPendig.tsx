import { useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from 'react'
import { Box, Button, IconButton, Input, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { Dialog } from "primereact/dialog";
import { RiCheckLine, RiBookmark2Fill, RiTruckFill } from 'react-icons/ri'
import { useMutation, useQuery } from 'react-query';
import { getSimpleHistorial, postHistorialPayload } from 'services/api/products';
import { bigTotal } from 'helpers/bigTotal';
import { getProductById } from "services/api/products";

import moment from 'moment';
import { getOrderPendiente } from 'services/api/orders';
import { MdArrowCircleDown, MdEdit } from 'react-icons/md';

interface OrderPending {
  listOrder: any
  headerTitle: String | undefined,
  isVisible: boolean,
  idProduct: number | undefined,
  children?: JSX.Element,
  toogle?: string
  setVisible?: Dispatch<SetStateAction<any>>;
  setVisibleArticle?: Dispatch<SetStateAction<any>>;
  setPedido?: Dispatch<SetStateAction<any>>;
  onHandleHide: () => void,
  onHandleAgree?: () => void
}

const OrderPending = (props: OrderPending) => {
  var orders: any[] = []
  const closeDialog = () => {
    props.onHandleHide()
  }

  const reciveArtcle = (orden: any) => {
    props.setVisible?.(false)
    props.setVisibleArticle?.(true);
    props.setPedido?.(orden)
  }

  if (props.listOrder != undefined) {
    props.listOrder.forEach((orden: any) => {
      orders.push(orden)
    });
  }
  /*if(ordenes != undefined){
    ordenes.forEach((orden:any) => {
      var articulos : any [] = orden.attributes.articulos.data
      articulos.forEach((articulo : any) => {
        if(articulo.id == props.idProduct){
          orders.push(orden);
        }
      });
      
    });
    
  }*/

  return (
    <Dialog style={{ width: '600px', height: '500px' }} header={`${props.headerTitle} `} modal
      onHide={closeDialog}
      visible={props.isVisible}>
      {orders.length != 0 && <List spacing={3} mt='2' py='3' height={'20rem'} overflowY='scroll'>
        {orders?.map((orden: any) => (
          <ListItem display='flex' alignItems='center' fontWeight='bold' key={orden.id}>
            <ListIcon as={RiTruckFill} fontSize='40' color='#e1d004' />
            <Box display='flex' justifyContent='space-between' w='100%' h='100%'>
              <Box>
                <Text>{orden.attributes.comentario}</Text>
                <Text>{orden.attributes.estatus}</Text>
                <Text fontSize='13' fontWeight='medium'>{moment(orden.attributes.createdAt).format('L, h:mm:ss a')}</Text>
              </Box>
              <Box display='flex' alignItems='center' marginRight='5'>
                <IconButton aria-label='show dialog' icon={<MdArrowCircleDown />} borderRadius='full' colorScheme='green'
                  onClick={() => reciveArtcle(orden)} fontSize='20px' size='lg' />
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>}
      {orders.length == 0 && <Text>NO HAY ORDENES PENDIENTES DE ESTE ARICULO</Text>}
    </Dialog>
  );
}

export default OrderPending;