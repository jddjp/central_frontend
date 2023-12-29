import { useEffect, useRef, useState } from 'react'
import { Badge, Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getProductBySucursal, getProducts } from 'services/api/products';
import Confirmation from 'components/modals/Confirmation';
import ArticlePostDetail from 'components/modals/ArticlePostDetail';
import ArticlePutDetail from 'components/modals/ArticlePutDetail';
import OrdenRefill, { AlertOrdenRefill } from 'components/modals/OrdenRefill'
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "./style.css"
import React from 'react';
import { getClients } from 'services/api/cliente';
import { getSucursales } from 'services/api/articles';
import { getUsuarios } from 'services/api/users';
import UsuarioModal from './modals/usuarios';
const UsuariosPage = () => {


  //const sucursalRef = localStorage.getItem('sucursal')
  //const queryClient = useQueryClient()
  const idRef = useRef(0);
  //const [rolFlag, setRolFlag] = useState(true);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [newUsuario, setNewUsuario] = useState(false);

  const ordenRefillRef = useRef<AlertOrdenRefill>(null);

  const { data: usuarios, refetch } = useQuery(["usuarios"], () => getUsuarios())
  //const removeProduct = useMutation(deleteStock)

  const openNewUsuario = () => {
    setNewUsuario(true);
    setVisibleEdit(true)
  }
  const openDialogEdit = (id: number) => {
    idRef.current = id
    setNewUsuario(false)
    setVisibleEdit(true);
  }

  const hideDialogPut = () => {
    idRef.current = 0;
    setVisibleEdit(false);
  };
  const hideDialogDelete = () => {
    idRef.current = 0
    setVisibleDelete(false);
  }
  const confirmDelete = (id: number) => {
    idRef.current = id
    setVisibleDelete(true);
  }

  const handleDelete = () => {
    hideDialogDelete()
    /*removeProduct.mutate(idRef.current, {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
       
      }
    })*/
  }


  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  }

  return (
    <Grid  gap={1} className='ml-auto mr-auto'>
      <GridItem w='100%' h='10'  >

        <Box paddingTop='5' display='flex' margin='auto' className='aaaaaaaaa'>
          <DataTable paginator className="p-datatable-customers" showGridlines rows={10} editMode="row" tableStyle={{ minWidth: "80rem" }}
            value={usuarios?.map((usuario: any) => usuario)}
            header={
              <Box maxW="sm" justifyContent="flex-start">
                <Box p="6">
                  <Box display="flex" alignItems="baseline">
                    <Badge
                      borderRadius="full"
                      fontSize="16"
                      px="2"
                      colorScheme="teal"
                    >
                      USUARIOS
                    </Badge>
                  </Box>
                </Box>
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText
                    value={globalFilterValue1}
                    onChange={onGlobalFilterChange1}
                  />

                  <Button
                    label="Nuevo"
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    onClick={openNewUsuario}
                  />

                </span>
              </Box>
            }
            filters={{
              'attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
            }}>
            <Column field="username" header="Nombre Usuario" />
            <Column field="nombre" header="Nombre" />
            <Column field="apellido_paterno" header="Apellido" />
            <Column field="roleCons" header="Rol" />
            <Column field={"blocked"} header="Bloqueado" />


            <Column header='Acciones' body={(data: any) => (
              <Box display='flex' >
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" style={{ marginRight: '5px' }} onClick={() => openDialogEdit(data.id)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" style={{ marginRight: '5px' }} onClick={() => confirmDelete(data.id)} />
              </Box>)}
              exportable={false} style={{ minWidth: '8rem' }} />

          </DataTable>
          <Confirmation
            isVisible={visibleDelete}
            titleText={'¿Estas seguro de eliminar al cliente ?'}
            onHandleHide={hideDialogDelete}
            onHandleAgree={handleDelete} />
          <UsuarioModal
            isVisible={visibleEdit}
            newUsuario={newUsuario}
            onHandleHide={hideDialogPut}
            referenceId={idRef.current}></UsuarioModal>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default UsuariosPage;