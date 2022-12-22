import React from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { useState } from "react";
import { Card } from 'primereact/card';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQuery } from 'react-query';
import moment from 'moment';
import { getDespachadores, getPedidos } from 'services/api/users';
import { elementDragControls } from 'framer-motion/types/gestures/drag/VisualElementDragControls';


export default function AccountsPage() {
  const atribute = {
    pedidos : []
  }
  const { data: users } = useQuery(["users"], getDespachadores)
  const { data: pedidos } = useQuery(["pedidos"], getPedidos);
  const [DespaPedidos, setDespaPedidos] = useState(atribute);
  const [visible, setVisible] = useState(false);
 
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
  const hideDialog = () => {
    setVisible(false);
  }
  const pedidosDialogoFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    </>
  );
  return (
    <Box width='90%' display='flex' margin='auto'>
      <Stack spacing='3.5' direction='row' wrap='wrap'>
        {users?.map((user: any) => (
          <Card title={user.username} subTitle={user.email} footer={user.roleCons} style={{width: '250px', marginTop: '1.25em'}}>
            <>
              <Button
                icon="pi pi-arrow-up-right"
                className="p-button-rounded p-button-success mr-2 p-button-text"
                onClick={() =>open(user.id)}
              />
             
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
                <Column field="comentario" header="Comentario" />
              </DataTable>
            </>
      </Dialog>
      </Stack>
    </Box>
  )
}