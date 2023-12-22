import React, { ChangeEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { editProduct, getProductById, getProductByIdAndStore, getStocksByProductId, getStocksProductId } from "services/api/products";
import { Box, Flex, Link, Stack, useToast } from '@chakra-ui/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getSubsidiaries } from 'services/api/subsidiary';
import { categoria, estado, initProduct, initStock, unidadMedida } from 'helpers/constants';
import { BASE_URL } from 'config/env';
import { RiExternalLinkLine } from 'react-icons/ri';
import { TabView, TabPanel } from 'primereact/tabview';
import { getProductsMini } from 'services/api/productservice'
import { Column  } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Stock } from '../../types/Stock'
import { OrderRefill,  } from 'types/OrderRefil';
import { Checkbox } from 'primereact/checkbox';



import { cellEditor, onCellEditComplete, priceBodyTemplate, priceEditor, recuperarCantidad, saveStockProd, textEditor, validLimitStock, validarExistenciaUnidadEnStock } from 'helpers/inventario'
import OrdenRefill, { AlertOrdenRefill } from './OrdenRefill';
import { InputSwitch } from 'primereact/inputswitch';
import { deleteRupturaPrecio, postRuptura } from 'services/api/ruptura';


interface PropArticleDetail {
  isVisible: boolean,
  referenceId: number,
  referenceSucursal: string,

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

const ArticlePutDetail = (props: PropArticleDetail) => {

  const queryClient = useQueryClient()
  const updateProduct = useMutation(editProduct)
  const createRuptura = useMutation(postRuptura);
  const removeRuptura = useMutation(deleteRupturaPrecio)
  var { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries)
  const [activeIndex, setActiveIndex] = useState(0);
  const [rupuraId , setRupturaId] = useState(0);
  const [product, setProduct] = useState({
    nombre: "",
    marca: "",
    inventario_fiscal: 0,
    inventario_fisico: 0,
    descripcion: "",
    categoria: "",
    codigo_barras: "",
    codigo_qr: "",
    estado: "",
    foto: "",
    isFiscal: false,
    isFisical: false,
    iva: 0,
    // cantidad_stock: 0,
    unidad_de_medida: 0,
    isFacturable: false,
    clave_prod_serv: "",
    ruptura_precio: {
      data: {
        attributes: {
          rango_ruptura_precios: {
            data: [{
              precio: 0,
              cantidad: 0
            }]
          }
        }
      }
    }
  })
  const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0
  })

  const toast = useToast()
  const [facturable, setFacturable] = useState(false);
  const [storesSelected, setStoresSelected] = useState([]);
  const [selectedStoresForDeletion, setSelectedStoresForDeletion] = useState(Array<number>); // Estado para los elementos seleccionados para eliminar

  const [stockProduct, setStockProduct] = useState([]);
  const [rangosRupturaProductos, setRangosRupturaProductos] = useState<{

  }[]>([]);

  const [stockProductTemp, setStockProductTemp] = useState<Stock[]>([]);
  useQuery(["productEdit", props.referenceId, props.referenceSucursal], () => getProductByIdAndStore(props.referenceId, props.referenceSucursal), {
    onSuccess(data: any) {
      setProduct({
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
        unidad_de_medida: data.articulo ? data?.articulo?.data?.attributes?.unidad_de_medida.data.id : '',
        clave_prod_serv: data.articulo ? data?.articulo?.data?.attributes?.clave_prod_serv : '',
        ruptura_precio: data.articulo ? data?.articulo?.data?.attributes?.ruptura_precio : ''
      })
      setStock({
        cantidad: data.cantidad ? data.cantidad : 0,
        unidad_de_medida: data.cantidad ? data.unidad_de_medida.data.id : '',
        sucursal: data.sucursal ? data.sucursal.data.id : '',
      })
      setFacturable(data.articulo ? data.articulo.data.attributes.isFacturable : false)
      if(data?.articulo?.data?.attributes?.ruptura_precio.data.id != undefined){
        setRupturaId(data.articulo.data.attributes.ruptura_precio.data.id)
      }

      var rangos : any = data?.articulo?.data?.attributes?.ruptura_precio.data.attributes.rango_ruptura_precios.data

      if(rangos != undefined){
        rangos = rangos?.sort((a : any,b : any) => (a.attributes.cantidad < b.attributes.cantidad ? -1:1))
        rangos.shift()
        setRangosRupturaProductos(rangos ? rangos : '')
      }
     
      if (data.articulo != undefined) {
        setPedidos(
          [...data.articulo.data.attributes.orden_refills.data])
      }
    },
  })
  const [pedidos, setPedidos] = useState<Array<OrderRefill>>([{
    id: 1,
    attributes: {
      cantidad: 2,
      createdAt: "12-01-2023",
      created__by: 0,
      articulo: 1
    }
  }]);

  //Obtiene los stocks de cada producto y genera un arreglo de ids de
  useQuery(["productStocks", props.referenceId, props.referenceSucursal], () => getStocksProductId(props.referenceId), {
    onSuccess(data: any) {
      let dataSuc: any = [];
      data?.map((subsiduary: any) => {
        dataSuc.push(subsiduary.id);
      })
      setStoresSelected(dataSuc)
    },
  })

  //Obtiene los stocks de cada producto
  useQuery(["getStocksByProductId", props.referenceId, props.referenceSucursal], () => getStocksByProductId(props.referenceId), {
    onSuccess(data: any) {
      setStockProduct(data);
      setStockProductTemp(data);
    },
  })

  const onHandleHide = () => {
    props.onHandleHide()
    setSelectedStoresForDeletion([]);
    setStockProduct([]);
    setStockProductTemp([]);
    setStoresSelected([])
    setActiveIndex(0);
  }
  const HandleUpdateProduct = async () => {
    //Valida que no se ingrese una cantidad de stock mayor a la general
    if (product.inventario_fisico < validLimitStock(stockProduct)) {
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
    }

    updateProduct.mutate({ id: props.referenceId, edit: { data: product }, stock: { data: stock } }, {
      onSuccess: async () => {
        queryClient.invalidateQueries(['products'])
        setProduct(initProduct)
        //setStock(initStinitProductinitProductock)
        //Actualiza el stock de las unidades
        await saveStockProd(props.referenceId, stockProduct, product, selectedStoresForDeletion);
        onHandleHide()
      }
    })


  }

  const saveRuptura = async () =>{
    rangosRupturaProductos.forEach((ruptura: any) => {
      if(ruptura.id == undefined){
        if( ruptura["attributes.precio"] == 0 ||  ruptura["attributes.precio"] == undefined){
          toast({
            title: "El precio debe ser mayor a 0",
            status: "error",
          });
  
          return "";
        }
        if( ruptura.attributes.cantidad == 0 ||  ruptura.attributes.cantidad == undefined){
          toast({
            title: "La cantidad debe ser mayor a 0",
            status: "error",
          });
  
          return "";
        }
        createRuptura.mutate(
          { data: { 
            cantidad: ruptura.attributes.cantidad.toString(),
            precio: ruptura["attributes.precio"],
            ruptura_precio : rupuraId
          } },
          {
            onSuccess: async (data) => {
              toast({
                title: "Ruptura guardadas correctamente",
                status: "success",
              });
            },
          }
        );
      }
    });
  }

  const handleSelectStore = (data: any) => {
    const id = data.selectedOption.value;
    if (selectedStoresForDeletion.includes(id)) {
      setSelectedStoresForDeletion(selectedStoresForDeletion.filter(item => item !== id));
    } else {
      let dat: Stock = {
        attributes: {
          cantidad: 0,
          sucursal: {
            data: {
              id: id,
              attributes: {
                nombre: data.selectedOption.name
              }
            }
          }
        }
      };

      if (!validarExistenciaUnidadEnStock(stockProductTemp, id)) {
        stockProductTemp.push(dat)
      }
      setSelectedStoresForDeletion(prevSelectedStores => [...prevSelectedStores, id]);
    }
    setStoresSelected(data.value);
    //Se recupera la cantidad stock de la unidad seleccionada para casos
    //que se deseleccione por equivocacion
    const restoreStore: any = recuperarCantidad(stockProductTemp, data.value);
    setStockProduct(restoreStore);
  }




  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHandleHide} />
      {activeIndex == 0 && <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={HandleUpdateProduct} />}

      {activeIndex == 1 && <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveRuptura} />}
    </>
  );

  const onInputTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.value });
  }
  const onDropdownChange = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  }
  const onInputNumberChangeStock = (e: InputNumberChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.value });
  }
  const onDropdownChangeStock = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  }
  const onUpload = (e: any) => {
    setProduct({ ...product, [e.target.name]: e.target.files })
  }

  const changeFacturable = (e: any) => {
    setProduct({ ...product, isFacturable: e.value });
    setFacturable(e.value);
  };

  useEffect(() => {
    setProduct({ ...product, isFiscal: product.inventario_fiscal ? true : false });
  }, [product.inventario_fiscal]);

  const [products, setProducts] = useState<Product[] | null>(null);

  const columnsTableInventario: ColumnMeta[] = [
    { field: 'attributes.sucursal.data.attributes.nombre', header: 'Sucursal' },
    { field: 'attributes.cantidad', header: 'Cantidad' },
  ];

  const columnsTableRuptura: ColumnMeta[] = [
    { field: 'attributes.cantidad', header: 'Cantidad' },
    { field: 'attributes.precio', header: 'Precio' },
  ];

  const columnsTablePedidos: ColumnMeta[] = [
    { field: 'attributes.cantidad', header: 'Cantidad' },
    { field: 'attributes.createdAt', header: 'Fecha' },
    { field: 'attributes.created__by.data.attributes.nombre', header: 'Supervisor' },
  ];

  useEffect(() => {
    getProductsMini().then((data) => setProducts(data));
  }, []);


  useEffect(() => {
    setProduct({ ...product, isFisical: product.inventario_fisico ? true : false })
  }, [product.inventario_fisico]);

  const ordenRefillRef = useRef<AlertOrdenRefill>(null);

  const handleCreateOrder = () => {
    ordenRefillRef.current?.open(props.referenceId);
  }

  const hideDialogOrder = () => {
  }
  const changeTabs = async (index: any) => {
    setActiveIndex(index)
    if (index == 2) {
      queryClient.invalidateQueries(["getStocksByProductId"]);
    }
    if (index == 3) {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["productEdit"]);
    }
  };
  const _handleAgregarRuptura = () => {
    const rango = {
      attributes: {
        cantidad: "1",
        precio: "0"
      },
    }
    setRangosRupturaProductos([...rangosRupturaProductos, rango])

  }

  const removeRango = (data: any, column:any) => {
    return <Button icon="pi pi-times" rounded severity="danger" aria-label="Cancel" size="small" onClick={() => _handelRemoveRango(column.rowIndex)} />;
  };

  const _handelRemoveRango = (index: number) => {
      const nuevoArray = [...rangosRupturaProductos];
      let selectRuptura : any= nuevoArray[index]
      if(selectRuptura.id == undefined){
        nuevoArray.splice(index, 1);
        setRangosRupturaProductos(nuevoArray)
        return;
      }
      removeRuptura.mutate(selectRuptura.id, {
        onSuccess: () => {
          nuevoArray.splice(index, 1);
          setRangosRupturaProductos(nuevoArray)
        }
      })
      
    
  }

  return (
    <Dialog style={{ width: '60%' }} header="DETALLE DEL ARTICULO" modal className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}>
      <Stack spacing='1rem'>
        <TabView activeIndex={activeIndex} onTabChange={(e) => { changeTabs(e.index) }}>
          <TabPanel header="Datos" leftIcon="pi pi-fw pi-home">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText value={product.nombre} onChange={onInputTextChange} autoFocus name='nombre' />
            </div>
            <div className="field">
              <label htmlFor="name">Marca</label>
              <InputText value={product.marca} onChange={onInputTextChange} name='marca' />
            </div>
            <br></br>
            <div className="field">
              <h5>Facturable</h5>
              <InputSwitch
                onChange={(e) => changeFacturable(e)}
                checked={facturable}
              />
            </div>
            <br></br>
            {
              facturable ? (
                <div className="field">
                  <h5>Clave de producto facturable</h5>
                  <InputText value={product.clave_prod_serv} onChange={onInputTextChange} autoFocus name='clave_prod_serv' />
                </div>
              ) : ""
            }
            {facturable && <div className="field">
              <label htmlFor="name">Inventario fiscal</label>
              <InputNumber value={product.inventario_fiscal} onChange={(e: any) => onInputNumberChange(e, 'inventario_fiscal')} required />
            </div>}

            <div className="field">

              <label htmlFor="name">Inventario fisico</label>
              <InputNumber disabled={true} value={product.inventario_fisico} onChange={(e: any) => onInputNumberChange(e, 'inventario_fisico')} required />

            </div>
            <div className="field">
              <label htmlFor="name">Descripción</label>
              <InputText value={product.descripcion} onChange={onInputTextChange} required name='descripcion' />
            </div>
            <div className="field">
              <label htmlFor="name">Cod. barras</label>
              <InputText value={product.codigo_barras} onChange={onInputTextChange} required name='codigo_barras' />
            </div>
            <div className="field">
              <label htmlFor="name">Cod. Qr</label>
              <InputText value={product.codigo_qr} onChange={onInputTextChange} required name='codigo_qr' />
            </div>
            <div className="field">
              <label htmlFor="name">Estado</label>
              <Dropdown inputId="dropdown" value={product.estado} options={estado} onChange={(e: any) => onDropdownChange(e, 'estado')} optionLabel="name" />
            </div>
            <div className="field">
              <label htmlFor="name">Categoria</label>
              <Dropdown inputId="dropdown" value={product.categoria} options={categoria} onChange={(e: any) => onDropdownChange(e, 'categoria')} optionLabel="name" />
            </div>

            {/* <div className="field">
              <label htmlFor="name">Cantidad / Stock</label>
              <InputNumber value={product.cantidad_stock} onChange={(e: any) => onInputNumberChangeStock(e, 'cantidad_stock')} required />
            </div> */}

            <div className="field">
              <label htmlFor="name">Unidad de Medida</label>
              <Dropdown inputId="dropdown" value={product.unidad_de_medida} options={unidadMedida} onChange={(e: any) => onDropdownChangeStock(e, 'unidad_de_medida')} optionLabel="name" required />
            </div>
            {/* <div className="field">
              <label htmlFor="name">Sucursales</label>
              <Dropdown inputId="dropdown" value={stock.sucursal} options={subsidiaries?.map((subsiduary: any) => {
                return {
                  value: subsiduary.id,
                  name: subsiduary.attributes.nombre
                }
              })}
                onChange={(e: any) => onDropdownChangeStock(e, 'sucursal')} optionLabel="name" required
              />
            </div>*/}
            <div className="field">
              <label htmlFor="name">IVA</label>
              <InputNumber value={product.iva} onChange={(e) => onInputNumberChange(e, 'iva')} required />
            </div>
            <br></br>
            {/* <FileUpload mode="basic" name="foto" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
            <input type="file" accept="image/*" onChange={onUpload} name='foto' />

            {typeof product.foto === 'string' && (
              // <a href=>{product.nombre}</a>
              <Link href={`${BASE_URL}${product?.foto}`} isExternal display='inline-flex' alignItems='center' gap='0.5rem' color='blue.600' width='fit-content'>
                {product?.foto}<RiExternalLinkLine size='22px' />
              </Link>
            )}
          </TabPanel>

          {/*Tabla de Ruptura de precios*/}
          <TabPanel header="Ruptura de precios" leftIcon="pi pi-fw pi-dollar">
            {product.ruptura_precio &&
              <div>
                <DataTable value={rangosRupturaProductos?.map((element: any) => element)} editMode="cell" tableStyle={{ minWidth: '50rem' }}>
                  {columnsTableRuptura.map(({ field, header }) => {
                    return <Column key={field} field={field} header={header} style={{ width: '25%' }} body={field === 'price' && priceBodyTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />;
                  })}
                  <Column header={'Opciones'} style={{ width: '25%' }} body={removeRango}>

                  </Column>
                </DataTable>
                <Flex align="center" color="gray.300">
                  <Box>
                    <Button label='Agregar' onClick={() => _handleAgregarRuptura()}>

                    </Button>
                  </Box>
                </Flex>
              </div>
            }
          </TabPanel>
          <TabPanel header="Inventario" leftIcon="pi pi-fw pi-calendar">
            {/*//Lista donde estara disponible la sucursal*/}
            <MultiSelect
              options={subsidiaries?.map((subsiduary: any) => {
                return {
                  value: subsiduary.id,
                  name: subsiduary.attributes.nombre
                }
              })}
              onChange={(e) => handleSelectStore(e)}
              value={storesSelected}
              optionLabel="name"
              placeholder="Seleccionar sucursales"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
            {/*Tabla de stock por unidad*/}
            <DataTable value={stockProduct?.map((element: any) => element)} editMode="cell" tableStyle={{ minWidth: '50rem' }}>
              {columnsTableInventario.map(({ field, header }) => {
                return <Column key={field} field={field} header={header} style={{ width: '25%' }} body={field === 'price' && priceBodyTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />;
              })}
            </DataTable>
          </TabPanel>

          <TabPanel header="Historial Refill" leftIcon="pi pi-fw pi-list">
            {/*<Button icon="pi pi-plus" style={{ marginLeft: 'auto', display: 'block', marginBottom: '9px' }} className="p-button-rounded p-button-secondary" onClick={() => handleCreateOrder()} />
            <OrdenRefill referenceId={props.referenceId} ref={(ordenRefillRef)} onHandleHide={hideDialogOrder}></OrdenRefill>*/}
            <DataTable value={pedidos?.map((element: any) => element)} tableStyle={{ minWidth: '50rem' }}>
              {columnsTablePedidos.map(({ field, header }) => {
                return <Column key={field} field={field} header={header} style={{ width: '25%' }} />;
              })}
            </DataTable>
          </TabPanel>
        </TabView>
      </Stack>
    </Dialog>
  );
}

export default ArticlePutDetail;