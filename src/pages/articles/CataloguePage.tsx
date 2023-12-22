import { useEffect, useRef, useState } from 'react'
import { Box } from "@chakra-ui/react";
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
import OrdenRefill, {AlertOrdenRefill} from 'components/modals/OrdenRefill'
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "./style.css"
import React from 'react';

const CataloguePage = () => {
  
  const auth = useAuth()
  const sucursalRef = localStorage.getItem('sucursal')
  const queryClient = useQueryClient()
  const idRef = useRef(0);
  const [rolFlag, setRolFlag] = useState(true);
  const [ visibleCreate, setVisibleCreate] = useState(false);
  const [ visibleEdit, setVisibleEdit ] = useState(false);
  const [ visibleDelete, setVisibleDelete ] = useState(false);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [currentStore, setCurrentStore] = useState('');

  const ordenRefillRef = useRef<AlertOrdenRefill>(null);


  const { data: products,refetch } = useQuery(["products"], auth.user?.roleCons !== 'Supervisor' ? () => getProductBySucursal(Number(sucursalRef)) : getProducts, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
  })

  const removeProduct = useMutation(deleteStock)

  const openDialogPost = () => {
    setVisibleCreate(true);
  }
  const openDialogEdit = (id: number) => {
    idRef.current = id
    setVisibleEdit(true);
  }

  const hideDialogPost = () => {
    setVisibleCreate(false)
  }
  const hideDialogPut = () => {
    idRef.current = 0
    setVisibleEdit(false)
  }

  const hideDialogOrder = () => {
    queryClient.invalidateQueries(['products'])
  }
  const hideDialogDelete = () => {
    idRef.current = 0
    setVisibleDelete(false);
  }
  const confirmDelete = (id: number) => {
    idRef.current = id
    setVisibleDelete(true);
  }

  const handleDeleteProduct = () => {
    removeProduct.mutate(idRef.current, {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
        hideDialogDelete()
      }
    })
  }

  const handleCreateOrder =(id: number)=>{ 
    idRef.current = id
    ordenRefillRef.current?.open(id);
  }

  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  }

  useEffect(()=>{
    const role = localStorage.getItem('role');
    if (role === 'Cajero' || role === 'Vendedor') {
      setRolFlag(false);
    }

    const storedStore = localStorage.getItem("sucursal");
    if(storedStore !== null){
      setCurrentStore(storedStore)
    }
  },[]);

  return (
    <Box paddingTop='5' display='flex' margin='auto'>
      <DataTable paginator className="p-datatable-customers" showGridlines rows={10}  editMode="row" 
        value={products?.map((product: any) => product)} 
        header={
          <Box display='flex' justifyContent='flex-start'   >
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} />
              {rolFlag && (<Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openDialogPost} />)}
            </span>
          </Box>
        } 
        filters={{
          'attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
        }}>
        <Column field="attributes.nombre" header="Nombre" />
        <Column field="attributes.marca" header="Marca" />
        <Column field="attributes.inventario_fiscal" header="inventario_fiscal" style={{ width: "5%" }} />
        <Column field="attributes.inventario_fisico" header="Inventario fisico" style={{ width: "5%" }} />
        <Column field="attributes.descripcion" header="Descripción" style={{ width: "20%" }} />
        <Column field="attributes.categoria" header="Categoria" />
        <Column field="attributes.codigo_barras" header="Cod. Barra" />
        <Column field="attributes.codigo_qr" header="Cod. Qr" />
        <Column field="attributes.estado" header="Estado"/>
        {rolFlag && (
        <Column header='Acciones' body={(data: any) => ( 
          <Box display='flex' >
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success"  style={{marginRight:'5px'}} onClick={() => openDialogEdit(data.id)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" style={{marginRight:'5px'}} onClick={() => confirmDelete(data.id)} />
            <Button icon="pi pi-box" className="p-button-rounded p-button-secondary"  onClick={() => handleCreateOrder(data.id)} />
          </Box>)} 
          exportable={false} style={{ minWidth: '8rem' }} />
          )}
      </DataTable>

      {/* Modals */}
      <Confirmation 
      isVisible={visibleDelete} 
      titleText='¿Estas seguro que deseas eliminarlo?'
      onHandleHide={hideDialogDelete} 
      onHandleAgree={handleDeleteProduct}/>

      <ArticlePostDetail isVisible={visibleCreate} onHandleHide={hideDialogPost}/> 
      <ArticlePutDetail isVisible={visibleEdit} onHandleHide={hideDialogPut} referenceId={idRef.current} referenceSucursal={currentStore}/>
      <OrdenRefill ref={(ordenRefillRef)} onHandleHide={hideDialogOrder} referenceId={idRef.current} ></OrdenRefill>
    </Box>
  );
}

export default CataloguePage;