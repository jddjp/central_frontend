import { ChangeEvent, useEffect, useState } from 'react'
import { Stack, useToast } from "@chakra-ui/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSubsidiaries } from '../../services/api/subsidiary';
import { postProduct } from 'services/api/products';
import { categoria, estado, initProduct, initStock } from 'helpers/constants';
import { getUnidades } from 'services/api/articles';
import { TabView, TabPanel } from 'primereact/tabview';
import { cellEditor, onCellEditComplete, priceBodyTemplate, recuperarCantidad, saveStockProd, validLimitStock, validarExistenciaUnidadEnStock } from 'helpers/inventario';
import { Stock } from 'types/Stock';
import { MultiSelect } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface PropsArticleDetail {
  isVisible: boolean,
  onHandleHide: () => void
}

interface ColumnMeta {
  field: string;
  header: string;
}

const ArticleDetail = (props: PropsArticleDetail) => {

  const queryClient = useQueryClient()
  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries)
  const { data: unidadMedida } = useQuery(["unidades"], getUnidades)
  const createProduct = useMutation(postProduct)
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStoresForDeletion, setSelectedStoresForDeletion] = useState(Array<number>);
  const [stockProductTemp, setStockProductTemp] = useState<Stock[]>([]);
  const [storesSelected, setStoresSelected] = useState([]);
  const [stockProduct, setStockProduct] = useState([]);

  const toast = useToast()
  const columnsTableInventario: ColumnMeta[] = [
    { field: 'attributes.sucursal.data.attributes.nombre', header: 'Sucursal' },
    { field: 'attributes.cantidad', header: 'Cantidad' },
  ];

  const [product, setProduct] = useState({
    nombre: '',
    precio_lista: 0,
    marca: '',
    inventario_fiscal: 0,
    inventario_fisico: 0,
    descripcion: "",
    categoria: "",
    codigo_barras: "",
    codigo_qr: "",
    estado: "",
    foto: "",
    // peso: "",
    isFiscal: false,
    isFisical: false,
    fresh: true,
    unidad_de_medida: 0,
    cantidad_stock: 0,
  });

  const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0
  })

  const handleSaveProduct = () => {
    //Valida que no se ingrese una cantidad de stock mayor a la general
    if (product.cantidad_stock < validLimitStock(stockProduct)) {
      toast({
        title: 'El stock por sucursal es mayor al stock general',
        status: 'warning'
      })
      return
    }
    //product.unidad_de_medida = stock.unidad_de_medida;
    createProduct.mutate({ product: { data: product }, stock: { data: stock } }, {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(['products'])
        setProduct(initProduct)
        //setStock(initStock)
        props.onHandleHide()
        console.log("////////////////////");
        console.log(data.data.id);

        //Guarda el stock de las unidades
        await saveStockProd(data.data.id, stockProduct, product, selectedStoresForDeletion);
        //Limpia la lista de stocks a eliminar al deseleccionar una unidad
         setSelectedStoresForDeletion([]);
      }
    })

  }

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.onHandleHide} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSaveProduct} />
    </>
  );

  const onInputTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setStock({ ...stock, [tag]: e.value });
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
    setProduct({ ...product, [e.target.name]: e.target.files[0] })
  }

  useEffect(() => {
    setProduct({ ...product, isFiscal: product.inventario_fiscal ? true : false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.inventario_fiscal]);

  useEffect(() => {
    setProduct({ ...product, isFisical: product.inventario_fisico ? true : false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.inventario_fisico]);

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

  return (
    <Dialog style={{ width: '60%' }} header="Product Details" modal className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={props.onHandleHide}>
      <Stack spacing='2'>
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
              <InputNumber value={product.inventario_fiscal} onChange={(e) => onInputNumberChange(e, 'inventario_fiscal')} required />
            </div>
            <div className="field">
              <label htmlFor="name">Inventario fisico</label>
              <InputNumber value={product.inventario_fisico} onChange={(e) => onInputNumberChange(e, 'inventario_fisico')} required />
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
              <Dropdown value={product.estado} inputId="dropdown" options={estado} onChange={(e) => onDropdownChange(e, 'estado')} optionLabel="name" />
            </div>
            <div className="field">
              <label htmlFor="name">Categoria</label>
              <Dropdown value={product.categoria} inputId="dropdown" options={categoria} onChange={(e) => onDropdownChange(e, 'categoria')} optionLabel="name" />
            </div>

            {/* STOCKS  */}
            <div className="field">
              <label htmlFor="name">Cantidad / Stock</label>
              <InputNumber value={product.cantidad_stock} onChange={(e) => onInputNumberChangeStock(e, 'cantidad_stock')} required />
            </div>
            <div className="field">
              <label htmlFor="name">Unidad de Medida</label>
              <Dropdown value={product.unidad_de_medida} inputId="dropdown" options={unidadMedida} onChange={(e) => onDropdownChangeStock(e, 'unidad_de_medida')} optionLabel="name" required />
            </div>
            {/*  <div className="field">
              <label htmlFor="name">Sucursales</label>
              <Dropdown value={stock.sucursal} inputId="dropdown" options={subsidiaries?.map((subsiduary: any) => {
                return {
                  value: subsiduary.id,
                  name: subsiduary.attributes.nombre
                }
              })}
                onChange={(e) => onDropdownChangeStock(e, 'sucursal')} optionLabel="name" required
              />
            </div>*/}
            <div >
              <form action="">
                <input type="file" accept="image/*" onChange={onUpload} name='foto' />
              </form>
            </div>
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

export default ArticleDetail;
