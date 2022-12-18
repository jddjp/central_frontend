import { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Flex, Spacer} from '@chakra-ui/react'
import { Center, Square, Text } from '@chakra-ui/react'
import { getOrderPendiente, deleteOrder, putCliente } from "../../../services/api/orders";
import moment from "moment";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { useQuery, useMutation, useQueryClient } from "react-query";
//import {EditOrderModal} from "../../../../src/components/modals/editOrderModal";

const ListExistedOrdersPage = () => {
  const atribute = {
    nombre : "",
    apellido_paterno : "",
    apellido_materno : "",
    fecha: '',
    hora: '',
    articulos : []
  }

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [update, setUpdate] = useState(atribute);
  const queryClient = useQueryClient()
  const { data: orders } = useQuery(["orders"], getOrderPendiente);
  const updateCliente = useMutation(putCliente);
  const [id, setId] = useState(0);
  const { mutate } = useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })
  
  const openUpdate = (data :  any) => {
    const articulos = data.articulos.data
    const cliente = data.cliente.data.attributes
    update.nombre = cliente.nombre;
    update.apellido_paterno = cliente.apellido_paterno 
    update.apellido_materno = cliente.apellido_materno
    update.fecha = data.fecha_pedido;
    update.hora = data.hora_pedido;
    update.articulos = articulos;

    setId(data.cliente.data.id);
    setVisible(true);
  }


  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  };

  const hideDialog = () => {
    setVisible(false);
  }

  const onInputChangeUpdate = (e: any, name: any) => {
    setUpdate({...update, [name]: e.target.value});
  }

  const updaCliente = () => {
    updateCliente.mutate({id: id, update: {data: update}}, {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders'])
        setVisible(false);
      }
    })
  }
  const editOrderDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={updaCliente} />
    </>
  );
  return (
    <Stack w="80%" mx="auto" mt="10" spacing="5">
      <DataTable paginator showGridlines rows={10} className="p-datatable-customers"
        value={orders?.map((order:any) => {
          order.attributes.id = order.id
          return order.attributes;
        })}
        header={
          <Box display='flex' justifyContent='space-between'>
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Filtrar por nombre de cliente..."
            />
          </span>
          </Box>
        }
        filters={{
          estatus: { value: "pendiente", matchMode: FilterMatchMode.STARTS_WITH },
          "cliente.data.attributes.nombre": {
            value: globalFilterValue1,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        }}>

        <Column field="estatus" header="Estatus" />
        <Column field="fecha_pedido" header="Fecha Pedido" sortable />
        <Column header="Hora Pedido"
          body={(data: any) => {
            return moment(data.hora_pedido, "hhmm ").format("hh:mm a");
          }}/>
        <Column field="comentario" header="Comentario" style={{ width: "50%" }}/>
        <Column field="cliente.data.attributes.nombre" header="Cliente" />
        <Column body={(data: any) => (
            <>
              <Button
                icon="pi pi-arrow-up-right"
                className="p-button-rounded p-button-success mr-2 p-button-text"
                onClick={() =>openUpdate(data)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-warning p-button-text"
                onClick={() => mutate(data.id)}
              />
            </>
          )}
          exportable={false}
          style={{ minWidth: "8rem" }}/>
      </DataTable>

      <Dialog header="Detalle de Pedido" visible={visible} style={{ width: '80%' }} modal className="p-fluid" footer={editOrderDialogFooter} onHide={hideDialog}>
      <Flex mt='5px'>
          <Center w='33%'></Center>
          <Center  w='33%'>
          <strong>Fecha de pedido:    </strong><Text>{update.fecha}</Text>
          </Center>
          <Center  w='33%'>
               <Text><strong>Hora de pedido: </strong>{update.hora}</Text>
          </Center>
       </Flex>
      <Flex>
          <Center>
            <Text fontSize={'19px'}><strong>Cliente</strong></Text>
          </Center>
       </Flex>
      <Flex mt='5px'>
          <Center w='33%'>
            <label htmlFor="name"><strong>Nombre</strong></label>
          </Center>
          <Center  w='33%'>
            <label htmlFor="name"><strong>Apellido Paterno</strong></label>
          </Center>
          <Center  w='33%'>
            <label htmlFor="name"><strong>Apellido Materno</strong></label>
          </Center>
       </Flex>
       <Flex>
          <Square size='33%' mr='10px'>
            <InputText value={update.nombre} onChange={(e: any) => onInputChangeUpdate(e, 'nombre')} />
          </Square>
          <Center  w='33%'  mr='10px'>
            <InputText  value={update.apellido_paterno} onChange={(e: any) => onInputChangeUpdate(e, 'apellido_paterno')} />
          </Center>
          <Center  w='33%'>
            <InputText  value={update.apellido_materno} onChange={(e: any) => onInputChangeUpdate(e, 'apellido_materno')}/>
          </Center>
        </Flex>
        <Flex mt={'15px'}>
          <Center>
            <Text fontSize={'18px'}><strong>Orden</strong></Text>
          </Center>
       </Flex>
          <>
            <DataTable value={update?.articulos?.map((element : any) =>{
                  return element.attributes
              })}> 
              <Column field="nombre" header="Nombre" />
              <Column field="descripcion" header="Descripción" />
              <Column field="precio_lista" header="Precio" />
            </DataTable>
          </>
      </Dialog>
    </Stack>
  );
};

export default ListExistedOrdersPage
