import React from 'react';
import { Box, Flex, Icon, Stack } from '@chakra-ui/react';
import { useState } from "react";
import { Card } from 'primereact/card';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Center, Text } from '@chakra-ui/react'
import { useMutation, useQuery } from 'react-query';
import moment from 'moment';
import { getDespachadores, getPedidos } from 'services/api/users';
import { MdCheckCircle, MdUnpublished } from 'react-icons/md';
import { putCheckOrders } from 'services/api/orders';

export default function AccountsPage() {
  const atribute = {
    pedidos : []
  }
  const articulo = {
    articulosP : []
  }
  const { data: users } = useQuery(["despachadores"], getDespachadores)
  const { data: pedidos } = useQuery(["pedidos"], getPedidos);
  const [id, setId] = useState(0)
  const [DespaPedidos, setDespaPedidos] = useState(atribute);
  const [articulos, setArticulos] = useState(articulo);
  const checkMutation = useMutation(putCheckOrders)
  const [visible, setVisible] = useState(false);
  const [visibleArticulo, setVisibleArticulo] = useState(false);

  const open = (data :  any) => {
    let despachador;
    let pedidosD : any = [];
    pedidos.data.forEach((pedido: any) =>{
      despachador = pedido.attributes.Despachador
        if(despachador === data.toString()){
          pedidosD.push(pedido);
        }
      } 
    );
    DespaPedidos.pedidos = pedidosD;
    setVisible(true);
  }
  const openArticulos = (data :  any, id: number) => {
    setId(id);
    const articulosData = data.attributes.articulos
    articulos.articulosP = articulosData.data ;
    setVisibleArticulo(true)
  }
  const hideDialog = () => {
    setVisible(false);
  }
  const hideDialogArticulo = () => {
    setId(0);
    setVisibleArticulo(false);
  }
  const pedidosDialogoFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    </>
  );
  const articulosDialogoFooter = (
    <>
      <Button label="Check" icon="pi pi-check" className="p-button p-button-success" onClick={() => checkMutation.mutate({id: id, despachador_check: true})}/>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialogArticulo} />
    </>
  );
  return (
    <Box width='90%' display='flex' margin='auto'>
      <Stack spacing='3.5' direction='row' wrap='wrap'>
        {users?.map((user: any) => (
          <Card title={user.username} subTitle={user.email}  style={{width: '250px', marginTop: '1.25em'}}>
            <>
              <Flex mt='5px'>
                  <Center  w='50%'>
                      <Text>{user.roleCons}</Text>
                  </Center>
                  <Center  w='50%'>
                  <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success mr-2 p-button-text"
                    title='Pedidos'
                    onClick={() =>open(user.id)}
                  />
                  </Center>
              </Flex>
            </>
          </Card>
        ))
        }
        
      <Dialog header="Pedidos de despachador" style={{ width: '80%' }} modal className="p-fluid" visible={visible} footer={pedidosDialogoFooter} onHide={hideDialog}>
            <>
              <DataTable value={DespaPedidos?.pedidos?.map((element : any) => element)}>
                <Column field="id" header="Pedido" />
                <Column field="attributes.estatus" header="Estatus" />
                <Column field='attributes.fecha_pedido' header="Fecha de pedido" />
                <Column  header="Hora Pedido" body={(data:any) => {
                    return moment(data.attributes.hora_pedido, 'hhmm ').format('hh:mm a')
                }}/>
                <Column field="attributes.comentario" header="Comentario" />
                <Column header="Check" field="attributes.despachador_check" body={(data: any) => (
                  data.attributes.despachador_check ? 
                    <Icon as={MdCheckCircle} w={6} h={6} color='green.500' /> :
                    <Icon as={MdUnpublished} w={6} h={6} color='red.500' />
                )}/>
                <Column header="Artículos" body={(data: any) => (
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-success mr-2 p-button-text"
                      title='Articulos del pedido'
                      onClick={() => openArticulos(data, data.id)}
                    />
                )}
                exportable={false}
                style={{ minWidth: "8rem" }}/>
              </DataTable>
            </>
      </Dialog>
      <Dialog header="Artículos" style={{ width: '30%' }} modal className="p-fluid" visible={visibleArticulo} footer={articulosDialogoFooter} onHide={hideDialogArticulo}>
            <>
            <DataTable value={articulos.articulosP.map((elementos : any) => elementos)}> 
              <Column field="attributes.nombre" header="Nombre" />
              <Column field="attributes.descripcion" header="Descripción" />
            </DataTable>
            </>
      </Dialog>
      </Stack>
    </Box>
  )
}