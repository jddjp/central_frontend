import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react'
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { editProduct, getProductById, getProductByIdAndStore, getStocksByProductId, getStocksProductId } from "services/api/products";
import { Link, Stack, useToast } from '@chakra-ui/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getSubsidiaries } from 'services/api/subsidiary';
import { categoria, estado, initProduct, initStock, unidadMedida } from 'helpers/constants';
import { BASE_URL } from 'config/env';
import { RiExternalLinkLine } from 'react-icons/ri';
import { deleteStock, deleteStockById, getStock, postStock, putStock, updateStock } from 'services/api/stocks';
import { TabView, TabPanel } from 'primereact/tabview';
import { getProductsMini } from 'services/api/productservice'
import { Column, ColumnEvent, ColumnEditorOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Stock } from '../../types/Stock'


import {cellEditor, onCellEditComplete, priceBodyTemplate, priceEditor, recuperarCantidad, saveStockProd, textEditor, validLimitStock, validarExistenciaUnidadEnStock} from 'helpers/inventario'


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
  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries)
  const [activeIndex, setActiveIndex] = useState(0);

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
    cantidad_stock: 0,
    unidad_de_medida: 0
  })
  const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0
  })

  const toast = useToast()

  const [storesSelected, setStoresSelected] = useState([]);
  const [selectedStoresForDeletion, setSelectedStoresForDeletion] = useState(Array<number>); // Estado para los elementos seleccionados para eliminar

  const [stockProduct, setStockProduct] = useState([]);
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
        cantidad_stock: data.articulo ? data?.articulo?.data?.attributes?.cantidad_stock : '',
        unidad_de_medida: data.articulo ? data?.articulo?.data?.attributes?.unidad_de_medida.data.id : ''
      })
      setStock({
        cantidad: data.cantidad ? data.cantidad : 0,
        unidad_de_medida: data.cantidad ? data.unidad_de_medida.data.id : '',
        sucursal: data.sucursal ? data.sucursal.data.id : '',
      })

    },
  })


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

  const HandleUpdateProduct = async () => {
    //Valida que no se ingrese una cantidad de stock mayor a la general
    if (product.cantidad_stock < validLimitStock(stockProduct)) {
      toast({
        title: 'El stock por sucursal es mayor al stock general',
        status: 'warning'
      })
      return
    }

    updateProduct.mutate({ id: props.referenceId, edit: { data: product }, stock: { data: stock } }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
        setProduct(initProduct)
        //setStock(initStock)
        props.onHandleHide()
      }
    })

    //Actualiza el stock de las unidades
    await saveStockProd(props.referenceId, stockProduct, product, selectedStoresForDeletion);
    //Limpia la lista de stocks a eliminar al deseleccionar una unidad
    setSelectedStoresForDeletion([]);
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
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.onHandleHide} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={HandleUpdateProduct} />
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
    setStock({ ...stock, [tag]: e.value });
  }
  const onDropdownChangeStock = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  }
  const onUpload = (e: any) => {
    setProduct({ ...product, [e.target.name]: e.target.files })
  }

  useEffect(() => {
    setProduct({ ...product, isFiscal: product.inventario_fiscal ? true : false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.inventario_fiscal]);

  const [products, setProducts] = useState<Product[] | null>(null);

  const columnsTableInventario: ColumnMeta[] = [
    { field: 'attributes.sucursal.data.attributes.nombre', header: 'Sucursal' },
    { field: 'attributes.cantidad', header: 'Cantidad' },
  ];
  useEffect(() => {
    getProductsMini().then((data) => setProducts(data));
  }, []);


  useEffect(() => {
    setProduct({ ...product, isFisical: product.inventario_fisico ? true : false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.inventario_fisico]);

  return (
    <Dialog style={{ width: '60%' }} header="Product Details" modal className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={props.onHandleHide}>
      <Stack spacing='1rem'>

        <TabView activeIndex={activeIndex}>
          <TabPanel header="Datos" leftIcon="pi pi-fw pi-home">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText value={product.nombre} onChange={onInputTextChange} autoFocus name='nombre' />
            </div>
            <div className="field">
              <label htmlFor="name">Marca</label>
              <InputText value={product.marca} onChange={onInputTextChange} name='marca' />
            </div>
            <div className="field">
              <label htmlFor="name">Inventario fiscal</label>
              <InputNumber value={product.inventario_fiscal} onChange={(e: any) => onInputNumberChange(e, 'inventario_fiscal')} required />
            </div>
            <div className="field">
              <label htmlFor="name">Inventario fisico</label>
              <InputNumber value={product.inventario_fisico} onChange={(e: any) => onInputNumberChange(e, 'inventario_fisico')} required />
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

            <div className="field">
              <label htmlFor="name">Cantidad / Stock</label>
              <InputNumber value={product.cantidad_stock} onChange={(e: any) => onInputNumberChangeStock(e, 'cantidad')} required />
            </div>

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
            {/* <FileUpload mode="basic" name="foto" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
            <input type="file" accept="image/*" onChange={onUpload} name='foto' />

            {typeof product.foto === 'string' && (
              // <a href=>{product.nombre}</a>
              <Link href={`${BASE_URL}${product?.foto}`} isExternal display='inline-flex' alignItems='center' gap='0.5rem' color='blue.600' width='fit-content'>
                {product?.foto}<RiExternalLinkLine size='22px' />
              </Link>
            )}
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
        </TabView>
      </Stack>
    </Dialog>
  );
}

export default ArticlePutDetail;