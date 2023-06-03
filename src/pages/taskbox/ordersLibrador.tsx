import { Box, Center, Flex, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useQuery } from "react-query";
import { getOrdersPending } from "services/api/orders";
import { getLibradores } from "services/api/users";

const OrderLibrador = () => {

  const atribute = {
    pedidos : []
  }
  const articulo = {
    articulosP : []
  }
  const { data: users } = useQuery(["users"], getLibradores)
  const { data: pedidos } = useQuery(["pedidos"], getOrdersPending);
  const [libraPedidos] = useState(atribute);
  const [articulos] = useState(articulo);
  const [visible, setVisible] = useState(false);
  const [visibleArticulo, setVisibleArticulo] = useState(false);

  const open = (data :  any) => {
    let librador;
    let pedidosL : any = [];
    pedidos?.forEach((pedido: any) =>{
      console.log(pedido.attributes.librador);
      librador = pedido.attributes.librador;
        if(librador === data.toString()){
          pedidosL.push(pedido);
        }
      } 
    );
    libraPedidos.pedidos = pedidosL;
    setVisible(true);
  }
  const openArticulos = (data :  any) => {
    const articulosData = data.attributes.articulos
    articulos.articulosP = articulosData.data ;
    setVisibleArticulo(true)
  }
  const hideDialog = () => {
    setVisible(false);
  }
  const hideDialogArticulo = () => {
    setVisibleArticulo(false);
  }
  const pedidosDialogoFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    </>
  );
  const articulosDialogoFooter = (
    <>
      <Button label="Check" icon="pi pi-check" className="p-button p-button-success"/>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialogArticulo} />
    </>
  );
  return (
    <Box width='90%' display='flex' margin='auto'>
      <Stack spacing='3.5' direction='row' wrap='wrap'>
        {users?.map((user: any, idx: number) => (
          <Card title={user.username} subTitle={user.email}  style={{width: '250px', marginTop: '1.25em'}} key={idx}>
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
        
      <Dialog header="Pedidos de Librador" style={{ width: '80%' }} modal className="p-fluid" visible={visible} footer={pedidosDialogoFooter} onHide={hideDialog}>
            <>
              <DataTable value={libraPedidos?.pedidos?.map((element : any) => element)}>
                <Column field="id" header="Pedido" />
                <Column field="attributes.estatus" header="Estatus" />
                <Column field='attributes.fecha_pedido' header="Fecha de pedido" />
                <Column  header="Hora Pedido" body={(data:any) => {
                    return moment(data.attributes.hora_pedido, 'hhmm ').format('hh:mm a')
                }}/>
                <Column field="attributes.comentario" header="Comentario" />
                <Column header="Artículos" body={(data: any) => (
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-success mr-2 p-button-text"
                      title='Articulos del pedido'
                      onClick={() => openArticulos(data)}
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

export default OrderLibrador;