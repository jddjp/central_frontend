import React from 'react';
import { Box, Flex, Stack, Text, Center } from '@chakra-ui/react';
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import {getArticulosPopulate } from 'services/api/articles';
import {getArticulosSustituto,  updateArticulosSustituto } from 'services/api/articles';



const Contador = () => {
  const atribute = {
    id: '',
    dataArticulo : []
  }
  const tab ='\u00A0';
  const queryClient = useQueryClient()
    const { data: articulo } = useQuery(["articulos"], getArticulosPopulate);
    const updateArticuloSustito = useMutation( updateArticulosSustituto);
    const { data: articuloSustito } = useQuery(["articulosSustitutos"], getArticulosSustituto);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [globalFilterValue2, setGlobalFilterValue2] = useState('');
    const [visibleArticulo, setVisibleArticulo] = useState(false);
    const onGlobalFilterChange1 = (e:any) => {
      setGlobalFilterValue1(e.target.value);
    }
    const onGlobalFilterChange2 = (e:any) => {
      setGlobalFilterValue2(e.target.value);
    }
 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [metaKey, setMetaKey] = useState(true);
  const [update, setUpdate] = useState(atribute);
  
   const openArticulos = (data :  any) => {
   console.log(data);
    const articulos = data.attributes.articulos_sustituto.data?.id;
    update.dataArticulo = data;
    update.id = articulos;
    console.log(update.id);
    if(update.id == undefined){
      update.id = 'Sin artículo sustituto asignado'
    }
   
    setVisibleArticulo(true)
  }
  const hideDialogArticulo = () => {
    setVisibleArticulo(false);
  }
  const updateDialogArticulo = () => {
    updateArticuloSustito.mutate({update: {data: update}, articulo : {data: selectedProduct}}, {
      onSuccess: () => {
        queryClient.invalidateQueries(['articulos'])
        setVisibleArticulo(false);
      }
    });
  }
  const articulosDialogoFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialogArticulo} />
      <Button label="Guardar"  icon="pi pi-check" className="p-button-text" onClick={updateDialogArticulo} />
    </>
  );
 
    return (
      <Stack w="80%" mx="auto" mt="10" spacing="5">
            <DataTable   width="80%" value={ articulo?.data.map((element: any) => {return (element)})}
             header={
              <Box display='flex' justifyContent='flex-start'>
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Filtrar por nombre del artículo ..." />
                </span>
              </Box>
            } 
            filters={{
              'attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
            }}
            >

                <Column field="attributes.nombre" header="Nombre" />
                <Column field="attributes.descripcion" header="Descripción" />
                <Column field="attributes.inventario_fisico" header="Inventario Físico" />
                <Column field="attributes.inventario_fiscal" header="Inventario Fiscal" />
                <Column header="Artículos Sustitutos" body={(data: any) => (
                    <>
                      <Button
                        icon="pi pi-eye"
                        className="p-button-rounded p-button-success mr-2 p-button-text"
                        title='Articulos del pedido'
                        onClick={() => openArticulos(data)}
                      />
                    </>
                  )}
                  exportable={false}
                  style={{ minWidth: "8rem" }}/>
            </DataTable>
            <Dialog header="Artículos Sustitutos" style={{ width: '70%' }}    className="p-fluid" visible={visibleArticulo} footer={articulosDialogoFooter} onHide={hideDialogArticulo}>
                  <>
                  <Flex mt='5px'>
                      <Center w='50%'></Center>
                      <Center  w='50%'>
                         <strong>id del producto sustituto asignado : {tab}</strong>
                         <Text>{update.id}</Text>
                      </Center>
                  </Flex>
                  <DataTable width={'100%'} value={ articuloSustito?.data.map((element: any) => {return (element)})} header={
                    <Box display='flex' justifyContent='flex-start'>
                      <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue2} onChange={onGlobalFilterChange2} placeholder="Filtrar por nombre del artículo ..." />
                      </span>
                    </Box>
                  } 
                  filters={{
                    'attributes.articulo.data.attributes.nombre': { value: globalFilterValue2, matchMode: FilterMatchMode.STARTS_WITH }
                  }}
                  selectionMode="single" selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)} dataKey="id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}> 
                    <Column field="id" header="id"/>
                    <Column field="attributes.articulo.data.attributes.nombre" style={{width:'50%'}} header="Nombre" />
                    <Column field="attributes.articulo.data.attributes.descripcion" style={{width:'50%'}} header="Descripción" />
                  </DataTable>
                  </>
            </Dialog>
      </Stack> 
    )
}
 
export default Contador;
 



