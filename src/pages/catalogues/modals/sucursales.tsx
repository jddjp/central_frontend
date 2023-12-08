import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { editProduct, getProductByIdAndStore,  } from "services/api/products";
import {  Stack, useToast } from '@chakra-ui/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { TabView, TabPanel } from 'primereact/tabview';
import { createSucursal } from 'services/api/articles';


interface PropArticleDetail {
  isVisible: boolean,
  referenceId: number,
  newSucursal : boolean
  onHandleHide: () => void,
}

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

interface ColumnMeta {
  field: string;
  header: string;
}

const SucusalesDetail = (props: PropArticleDetail) => {
  console.log(props.newSucursal)
  const queryClient = useQueryClient()
  const updateProduct = useMutation(editProduct)
  const [activeIndex, setActiveIndex] = useState(0);

  const [sucursal, setProduct] = useState({
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
  //const [facturable, setFacturable] = useState(false);
  

  const [rangosRupturaProductos, setRangosRupturaProductos] = useState<{

  }[]>([]);

  useQuery(["productEdit", props.referenceId], () => getProductByIdAndStore(props.referenceId, "0"), {
    onSuccess(data: any) {
      /*setProduct({
        nombre: data.articulo ? data.articulo.data.attributes.nombre : '',
        marca: data.articulo ? data.articulo.data.attributes.marca : '',
        inventario_fiscal: data.articulo ? data.articulo.data.attributes.inventario_fiscal : 0,
        inventario_fisico: data.articulo ? data.articulo.data.attributes.inventario_fisico : 0,
        descripcion: data.articulo ? data.articulo.data.attributes.descripcion : '',
        categoria: data.articulo ? data.articulo.data.attributes.categoria : '',
        codigo_barras: data.articulo ? data.articulo.data.attributes.codigo_barras : '',
        codigo_qr: data.articulo ? data.articulo.data.attributes.codigo_qr : '',
        estado: data.articulo ? data.articulo.data.attributes.estado : '',
        isFiscal: data.articulo ? data.articulo.data.attributes.isFiscal : false,
        isFisical: data.articulo ? data.articulo.data.attributes.isFisical : false,
        foto: data.articulo ? data?.articulo?.data?.attributes?.foto.data?.attributes?.url : '',
        iva: data.articulo ? data.articulo.data.attributes.iva : 0,
        isFacturable: data.articulo ? data.articulo.data.attributes.isFacturable : false,
        // cantidad_stock: data.articulo ? data?.articulo?.data?.attributes?.cantidad_stock : '',
        unidad_de_medida: data.articulo ? data?.articulo?.data?.attributes?.unidad_de_medida.data.id : '',
        clave_prod_serv: data.articulo ? data?.articulo?.data?.attributes?.clave_prod_serv : '',
        ruptura_precio: data.articulo ? data?.articulo?.data?.attributes?.ruptura_precio : ''
      })*/
      //setFacturable(data.articulo ? data.articulo.data.attributes.isFacturable : false)
      ///setRangosRupturaProductos(data.articulo ? data?.articulo?.data?.attributes?.ruptura_precio.data.attributes.rango_ruptura_precios.data : '')
      //console.log(rangosRupturaProductos)
    }
  })

  /*useQuery(["productStocks", props.referenceId, props.referenceSucursal], () => getStocksProductId(props.referenceId), {
    onSuccess(data: any) {
      let dataSuc: any = [];
      data?.map((subsiduary: any) => {
        dataSuc.push(subsiduary.id);
      })
      setStoresSelected(dataSuc)
    },
  })*/

  /*useQuery(["getStocksByProductId", props.referenceId, props.referenceSucursal], () => getStocksByProductId(props.referenceId), {
    onSuccess(data: any) {
      setStockProduct(data);
   
    },
  })*/

  const onHandleHide = () => {
    props.onHandleHide()
    /*setSelectedStoresForDeletion([]);
    setStockProduct([]);
    setStoresSelected([])
    setActiveIndex(0);*/
  }
  const HandleUpdateProduct = async () => {
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
    //Valida que no se ingrese una cantidad de stock mayor a la general
   /* if (product.inventario_fisico < validLimitStock(stockProduct)) {
      toast({
        title: 'El stock por sucursal es mayor al stock general',
        status: 'warning'
      })
      return
    }

    //Valida que ingrese el clave_prod_serv solicitado para facturar
    if (facturable && product.clave_prod_serv == "") {
      toast({
        title: "Asegurese de ingresar el codigo del producto facturable",
        status: "warning",
      });
      return;
    }*/

    /*updateProduct.mutate({ id: props.referenceId, edit: { data: product }, stock: {  } }, {
      onSuccess: async () => {
        queryClient.invalidateQueries(['products'])
        setProduct(initProduct)
        await saveStockProd(props.referenceId, stockProduct, product, selectedStoresForDeletion);
        onHandleHide()
      }
    })*/


  }

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHandleHide} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={HandleUpdateProduct} />
    </>
  );

  const onInputTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProduct({ ...sucursal, [e.target.name]: e.target.value });
  }
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setProduct({ ...sucursal, [tag]: e.value });
  }
  /*const onDropdownChange = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  }
  const onDropdownChangeStock = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  }*/

  const changeFacturable = (e: any) => {
    //setProduct({ ...product, isFacturable: e.value });
    //setFacturable(e.value);
  };

  /*useEffect(() => {
    setProduct({ ...product, isFiscal: product.inventario_fiscal ? true : false });
  }, [product.inventario_fiscal]);

  useEffect(() => {
    setProduct({ ...product, isFisical: product.inventario_fisico ? true : false })
  }, [product.inventario_fisico]);*/

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