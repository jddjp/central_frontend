import { useEffect, useRef, useState } from 'react'
import { Box, Text } from "@chakra-ui/react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getProductBySucursal, getProducts } from 'services/api/products';
import { deleteStock } from 'services/api/stocks';
import { useAuth } from 'hooks/useAuth';
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

const ClientesPage = () => {

  const auth = useAuth()
  const sucursalRef = localStorage.getItem('sucursal')
  const queryClient = useQueryClient()
  const idRef = useRef(0);
  const [rolFlag, setRolFlag] = useState(true);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [currentStore, setCurrentStore] = useState('');

  const ordenRefillRef = useRef<AlertOrdenRefill>(null);


  /*const { data: products, refetch } = useQuery(["products"], auth.user?.roleCons !== 'Supervisor' ?
   () => getProductBySucursal(Number(sucursalRef)) : getProducts, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
  })*/
  const { data: clientes , refetch } = useQuery(["clientes"],()=> getClients())
  //const removeProduct = useMutation(deleteStock)

  const openNewClient = () => {
    setVisibleCreate(true);
  }
  const openDialogEdit = (id: number) => {
    idRef.current = id
    setVisibleEdit(true);
  }

  /*const hideDialogPost = () => {
    setVisibleCreate(false)
  }
  const hideDialogPut = () => {
    idRef.current = 0
    setVisibleEdit(false)
  }

  const hideDialogOrder = () => {
    queryClient.invalidateQueries(['products'])
  }*/
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
    <Box paddingTop='5' display='flex' margin='auto'>
      <DataTable paginator className="p-datatable-customers" showGridlines rows={10} editMode="row"
        value={clientes?.map((product: any) => product)}
        header={
          <Box display='flex' justifyContent='flex-start'  >
            <span className="p-input-icon-left" >
              <i className="pi pi-search" />
              <InputText  value={globalFilterValue1} onChange={onGlobalFilterChange1} />
            </span>
            <Text padding={2}></Text>
            <Button label="Cliente" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNewClient} />
          </Box>
        }
        filters={{
          'attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
        }}>
        <Column field="attributes.nombre" header="Nombre" />
        <Column field="attributes.apellido_paterno"  header="Apellido" />
        <Column field="attributes.calle"  header="Calle" />
        <Column field="attributes.telefono"  header="telefono" />
        {rolFlag && (
          <Column header='Acciones' body={(data: any) => (
            <Box display='flex' >
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" style={{ marginRight: '5px' }} onClick={() => openDialogEdit(data.id)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" style={{ marginRight: '5px' }} onClick={() => confirmDelete(data.id)} />
            </Box>)}
            exportable={false} style={{ minWidth: '8rem' }} />
        )}
      </DataTable>
      <Confirmation
        isVisible={visibleDelete}
        titleText={'¿Estas seguro de eliminar al cliente ?'}
        onHandleHide={hideDialogDelete}
        onHandleAgree={handleDelete} />
      {/* Modals *
      <Confirmation
        isVisible={visibleDelete}
        titleText='¿Estas seguro que quieres que eliminarlo?'
        onHandleHide={hideDialogDelete}
        onHandleAgree={handleDeleteProduct} />

      <ArticlePostDetail isVisible={visibleCreate} onHandleHide={hideDialogPost} />
      <ArticlePutDetail isVisible={visibleEdit} onHandleHide={hideDialogPut} referenceId={idRef.current} referenceSucursal={currentStore} />
      <OrdenRefill ref={(ordenRefillRef)} onHandleHide={hideDialogOrder} referenceId={idRef.current} ></OrdenRefill>
    */}
    </Box>
  );
}

export default ClientesPage;