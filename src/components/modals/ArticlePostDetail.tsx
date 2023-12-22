import { ChangeEvent, useEffect, useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSubsidiaries } from "../../services/api/subsidiary";
import { postProduct } from "services/api/products";
import { categoria, estado, initProduct, initStock } from "helpers/constants";
import { getUnidades } from "services/api/articles";
import { TabView, TabPanel } from "primereact/tabview";
import { InputSwitch } from "primereact/inputswitch";
import Select, { SingleValue } from "react-select";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
//import 'primeflex/primeflex.css';

import {
  cellEditor,
  onCellEditComplete,
  priceBodyTemplate,
  recuperarCantidad,
  saveStockProd,
  validLimitStock,
  validarExistenciaUnidadEnStock,
} from "helpers/inventario";
import { Stock } from "types/Stock";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { postRuptura, postRupturaPrecio } from "services/api/ruptura";
import { postStock } from "services/api/stocks";

interface PropsArticleDetail {
  isVisible: boolean;
  onHandleHide: () => void;
}

interface ColumnMeta {
  field: string;
  header: string;
}

const ArticleDetail = (props: PropsArticleDetail) => {
  const queryClient = useQueryClient();
  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries);
  const { data: unidadMedida } = useQuery(["unidades"], getUnidades);
  const createProduct = useMutation(postProduct);
  const createRuptura = useMutation(postRuptura);
  const createRupturaPrecio = useMutation(postRupturaPrecio);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStoresForDeletion, setSelectedStoresForDeletion] = useState(
    Array<number>
  );
  const [stockProductTemp, setStockProductTemp] = useState<Stock[]>([]);
  const [storesSelected, setStoresSelected] = useState([]);
  const [stockProduct, setStockProduct] = useState([]);
  const [sucursal, setSucursal] = useState(0);
  const toast = useToast();
  const columnsTableInventario: ColumnMeta[] = [
    { field: "attributes.sucursal.data.attributes.nombre", header: "Sucursal" },
    { field: "attributes.cantidad", header: "Cantidad" },
  ];

  const [product, setProduct] = useState({
    nombre: "",
    precio_lista: 0,
    marca: "",
    inventario_fiscal: 0,
    inventario_fisico: 0,
    descripcion: "",
    categoria: "",
    codigo_barras: "",
    codigo_qr: "",
    estado: "",
    foto: "",
    iva: 0,
    isFiscal: false,
    isFisical: false,
    fresh: true,
    unidad_de_medida: 0,
    isFacturable: false,
    clave_prod_serv: "",
    // cantidad_stock: 0,
  });

  const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0,
  });

  const onHandleHide = () => {
    props.onHandleHide();
    setSelectedStoresForDeletion([]);
    setStockProduct([]);
    setStockProductTemp([]);
    setStoresSelected([]);
    setFacturable(false);
  };

  const handleSaveProduct = () => {
    //Valida que no se ingrese una cantidad de stock mayor a la general
    if (product.inventario_fisico < validLimitStock(stockProduct)) {
      toast({
        title: "El stock por sucursal es mayor al stock general",
        status: "warning",
      });
      return;
    }
    //Valida que ingrese el clave_prod_serv solicitado para facturar
    if (facturable && product.clave_prod_serv == "") {
      toast({
        title: "Asegurese de ingresar el codigo del producto facturable",
        status: "warning",
      });
      return;
    }

    if(sucursal == 0){
      toast({
        title: "Selecciona una sucursal",
        status: "error",
      });
      return;
    }

    if(product.precio_lista == 0){
      toast({
        title: "El precio debe ser mayor a 0",
        status: "error",
      });
      return;

    }

    if(stock.cantidad == 0){
      toast({
        title: "La cantidad a registrar debe ser mayor a 0",
        status: "error",
      });
      return;

    }

    if(product.nombre == "" || product.nombre == undefined){
      toast({
        title: "Ingresa un nombre valido",
        status: "error",
      });
      return;

    }
    product.inventario_fisico = stock.cantidad
    createProduct.mutate(
      { product: { data: product }, stock: { data: stock } },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(["products"]);
          setProduct(initProduct);
          //Guarda el stock de las unidades
          await saveStockProd(
            data.data.id,
            stockProduct,
            product,
            selectedStoresForDeletion
          );
          
          postStock({
            data: {
              cantidad: stock.cantidad,
              sucursal: sucursal,
              unidad_de_medida: product.unidad_de_medida,
              articulo: data.data.id,
            },
          });
          createRupturaPrecio.mutate(
            {
              data: {
                cantidad: "0",
                precio: "0",
                descripcion_descuento: product.nombre + "_ruptura",
                articulo: data.data.id,
                unidad_de_medida: product.unidad_de_medida,
              },
            },
            {
              onSuccess: async (data) => {
             
                createRuptura.mutate(
                  {
                    data: {
                      cantidad: "0",
                      precio: "0",
                      ruptura_precio: data.data.id,
                    },
                  },
                  {
                    onSuccess: async (data) => {
                  
                    },
                  }
                );

                createRuptura.mutate(
                  {
                    
                    data: {
                      cantidad: product.inventario_fisico.toString(),
                      precio: product.precio_lista.toString(),
                      ruptura_precio: data.data.id,
                    },
                  },
                  {
                    onSuccess: async (data) => {
                      toast({
                        title: "Articulo agregado correctamente",
                        status: "success",
                      });

                      onHandleHide();
                    },
                  }
                );
              },
            }
          );

         
        },
      }
    );
  };

  const productDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHandleHide}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={handleSaveProduct}
      />
    </>
  );

  const onInputTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setStock({ ...stock, [tag]: e.value });
  };
  const onDropdownChange = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  };
  const onInputNumber = (e: InputNumberChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.value });
  };
  const onDropdownChangeStock = (e: DropdownChangeEvent, tag: string) => {
    setProduct({ ...product, [tag]: e.target.value });
  };
  const onUpload = (e: any) => {
    setProduct({ ...product, [e.target.name]: e.target.files[0] });
  };

  const changeFacturable = (e: any) => {
    setProduct({ ...product, isFacturable: e.value });
    setFacturable(e.value);
  };
  const [facturable, setFacturable] = useState(false);

  useEffect(() => {
    setProduct({
      ...product,
      isFiscal: product.inventario_fiscal ? true : false,
    });
  }, [product.inventario_fiscal]);

  useEffect(() => {
    setProduct({
      ...product,
      isFisical: product.inventario_fisico ? true : false,
    });
  }, [product.inventario_fisico]);

  const handleSelectStore = (data: any) => {
    const id = data.selectedOption.value;
    if (selectedStoresForDeletion.includes(id)) {
      setSelectedStoresForDeletion(
        selectedStoresForDeletion.filter((item) => item !== id)
      );
    } else {
      let dat: Stock = {
        attributes: {
          cantidad: 0,
          sucursal: {
            data: {
              id: id,
              attributes: {
                nombre: data.selectedOption.name,
              },
            },
          },
        },
      };

      if (!validarExistenciaUnidadEnStock(stockProductTemp, id)) {
        stockProductTemp.push(dat);
      }
      setSelectedStoresForDeletion((prevSelectedStores) => [
        ...prevSelectedStores,
        id,
      ]);
    }
    setStoresSelected(data.value);
    //Se recupera la cantidad stock de la unidad seleccionada para casos
    //que se deseleccione por equivocacion
    const restoreStore: any = recuperarCantidad(stockProductTemp, data.value);
    setStockProduct(restoreStore);
  };
  const handleOrigenDistribucion = async (
    option: SingleValue<any>,
    target: string
  ) => {

    if(option != null && option != undefined){
      setSucursal(option.id)
    }
    else{
      localStorage.setItem('sucursal', "0")
    }
  }
  return (
    <Dialog
      style={{ width: "60%" }}
      header="NUEVO PRODUCTO"
      modal
      className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}
    >
      <Stack spacing="2">
        <TabView activeIndex={activeIndex}>
          <TabPanel header="Datos" leftIcon="pi pi-fw pi-home">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                value={product.nombre}
                onChange={onInputTextChange}
                autoFocus
                name="nombre"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Marca</label>
              <InputText
                value={product.marca}
                onChange={onInputTextChange}
                name="marca"
              />
            </div>
            <br></br>
            <div className="field">
              <h5>Facturable</h5>
              <InputSwitch
                onChange={(e) => changeFacturable(e)}
                checked={facturable}
              />
            </div>

            {facturable ? (
              <div className="field">
                <h5>Clave de producto facturable</h5>
                <InputText
                  value={product.clave_prod_serv}
                  onChange={onInputTextChange}
                  autoFocus
                  name="clave_prod_serv"
                />
              </div>
            ) : (
              ""
            )}
            <br></br>
            <Select
              onChange={(e) => handleOrigenDistribucion(e, "sucursal")}
              isClearable={true}
              placeholder="Selecciona sucursal"
              hideSelectedOptions
              key="origen-sucursal"
              options={subsidiaries?.map((subsidiary: any) => {
                return {
                  id: subsidiary?.id,
                  label: `${subsidiary.attributes?.nombre}`,
                };
              })}
            />

            {facturable && (
              <div className="field">
                <label htmlFor="name">Inventario fiscal</label>
                <InputNumber
                  value={product.inventario_fiscal}
                  onChange={(e) => onInputNumberChange(e, "inventario_fiscal")}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="name">Inventario fisico</label>
              <InputNumber
                value={product.inventario_fisico}
                onChange={(e) => onInputNumberChange(e, "cantidad")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="name">Descripción</label>
              <InputText
                value={product.descripcion}
                onChange={onInputTextChange}
                required
                name="descripcion"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Cod. barras</label>
              <InputText
                value={product.codigo_barras}
                onChange={onInputTextChange}
                required
                name="codigo_barras"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Cod. Qr</label>
              <InputText
                value={product.codigo_qr}
                onChange={onInputTextChange}
                required
                name="codigo_qr"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Estado</label>
              <Dropdown
                value={product.estado}
                inputId="dropdown"
                options={estado}
                onChange={(e) => onDropdownChange(e, "estado")}
                optionLabel="name"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Categoria</label>
              <Dropdown
                value={product.categoria}
                inputId="dropdown"
                options={categoria}
                onChange={(e) => onDropdownChange(e, "categoria")}
                optionLabel="name"
              />
            </div>

            {/* STOCKS  */}
            {/* <div className="field">
              <label htmlFor="name">Cantidad / Stock</label>
              <InputNumber value={product.cantidad_stock} onChange={(e) => onInputNumberChangeStock(e, 'cantidad_stock')} required />
            </div> */}
            <div className="field">
              <label htmlFor="name">Unidad de Medida</label>
              <Dropdown
                value={product.unidad_de_medida}
                inputId="dropdown"
                options={unidadMedida}
                onChange={(e) => onDropdownChangeStock(e, "unidad_de_medida")}
                optionLabel="name"
                required
              />
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
             <div className="field">
              <label htmlFor="name">Precio</label>
              <InputNumber
                value={product.precio_lista}
                onChange={(e) => onInputNumber(e, "precio_lista")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="name">IVA</label>
              <InputNumber
                value={product.iva}
                onChange={(e) => onInputNumber(e, "iva")}
                required
              />
            </div>
            <br></br>
            <div>
              <form action="">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  name="foto"
                />
              </form>
            </div>
          </TabPanel>
         { /*<TabPanel
            header="Ruptura de precios"
            leftIcon="pi pi-fw pi-calendar"
          ></TabPanel>*/}

          {/*<TabPanel header="Inventario" leftIcon="pi pi-fw pi-calendar">
           
            <MultiSelect
              options={subsidiaries?.map((subsiduary: any) => {
                return {
                  value: subsiduary.id,
                  name: subsiduary.attributes.nombre,
                };
              })}
              onChange={(e) => handleSelectStore(e)}
              value={storesSelected}
              optionLabel="name"
              placeholder="Seleccionar sucursales"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
            
            <DataTable
              value={stockProduct?.map((element: any) => element)}
              editMode="cell"
              tableStyle={{ minWidth: "50rem" }}
            >
              {columnsTableInventario.map(({ field, header }) => {
                return (
                  <Column
                    key={field}
                    field={field}
                    header={header}
                    style={{ width: "25%" }}
                    body={field === "price" && priceBodyTemplate}
                    editor={(options) => cellEditor(options)}
                    onCellEditComplete={onCellEditComplete}
                  />
                );
              })}
            </DataTable>
          </TabPanel>
            */}
        
        </TabView>
      </Stack>
    </Dialog>
  );
};

export default ArticleDetail;
