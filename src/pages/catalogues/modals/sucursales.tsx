import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { editProduct, getProductByIdAndStore,  } from "services/api/products";
import {  Stack, useToast } from '@chakra-ui/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { TabView, TabPanel } from 'primereact/tabview';
import { createSucursal, getSucursal } from 'services/api/articles';


interface PropSucursalDetail {
  isVisible: boolean,
  referenceId: number,
  newSucursal : boolean
  onHandleHide: () => void,
}

const SucusalesDetail = (props: PropSucursalDetail) => {
  const queryClient = useQueryClient()
  const updateProduct = useMutation(editProduct)
  const [activeIndex, setActiveIndex] = useState(0);

  const [sucursal, setSucursal] = useState({
    nombre: "",
    calle: "",
    colonia: "",
    numero_exterior: "",
    numero_interior: "",
    codigo_postal: 0,
    municipio: "",
    estado: "",
  })

  const toast = useToast()
  const createS = useMutation(createSucursal);

  useQuery(["nuevaSucursal", props.referenceId], props.referenceId !=0 ? () => getSucursal(props.referenceId) : () =>{}, {
    onSuccess(data: any) {
      if(data!= undefined){
        setSucursal(data.attributes)
      }
    }
  })

  const onHandleHide = () => {
    props.onHandleHide()
  }
  const HandleCreateProduct = async () => {
    createS.mutate(
      { sucursal },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(["sucursalesCatalogue"]);
          onHandleHide();
        },
      }
    );

    onHandleHide();
  }

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHandleHide} />
      {props.newSucursal && <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={HandleCreateProduct} />}
      {props.newSucursal! && <Button label="Actualizar" icon="pi pi-check" className="p-button-text" onClick={HandleCreateProduct} />}
    </>
  );

  const onInputTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSucursal({ ...sucursal, [e.target.name]: e.target.value });
  }
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setSucursal({ ...sucursal, [tag]: e.value });
  }

  return (
    <Dialog style={{ width: '60%' }} header="Nueva Sucursal" modal className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}>
      <Stack spacing='1rem'>
        <TabView activeIndex={activeIndex}>
          <TabPanel header="SUCURSAL" leftIcon="pi pi-fw pi-home">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText value={sucursal.nombre} onChange={onInputTextChange} autoFocus name='nombre' />
            </div>
            <div className="field">
              <label htmlFor="name">Calle</label>
              <InputText value={sucursal.calle} onChange={onInputTextChange} name='calle' />
            </div>
            <div className="field">
              <label htmlFor="name">Colonia</label>
              <InputText value={sucursal.colonia} onChange={onInputTextChange} name='colonia' />
            </div>
            <div className="field">
              <label htmlFor="name">Numero Exterior</label>
              <InputText value={sucursal.numero_exterior}  onChange={onInputTextChange} required name='numero_exterior'/>
            </div>
            <div className="field">
              <label htmlFor="name">Numero Interior</label>
              <InputText  value={sucursal.numero_interior}  onChange={onInputTextChange} required name='numero_interior' />
            </div>
            <div className="field">
              <label htmlFor="name">C.P.</label>
              <InputNumber value={sucursal.codigo_postal} onChange={(e: any) => onInputNumberChange(e, 'codigo_postal')} required />
            </div>
            <div className="field">
              <label htmlFor="name">Municipio</label>
              <InputText value={sucursal.municipio} onChange={onInputTextChange} required name='municipio' />
            </div>
            <div className="field">
              <label htmlFor="name">Estado</label>
              <InputText value={sucursal.estado} onChange={onInputTextChange} required name='estado' />
            </div>
          </TabPanel>
        </TabView>
      </Stack>
    </Dialog>
  );
}

export default SucusalesDetail;