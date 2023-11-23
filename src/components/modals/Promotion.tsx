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
import { createPromotion } from "services/api/promotions";
import { Calendar } from "primereact/calendar";

interface PropsPromotionDetail {
  isVisible: boolean;
  onHandleHide: () => void;
}

interface ColumnMeta {
  field: string;
  header: string;
}

const Promotion = (props: PropsPromotionDetail) => {
  const queryClient = useQueryClient();
  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries);
  const { data: unidadMedida } = useQuery(["unidades"], getUnidades);
  const cPromotion = useMutation(createPromotion);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStoresForDeletion, setSelectedStoresForDeletion] = useState(
    Array<number>
  );
  const [stockProductTemp, setStockProductTemp] = useState<Stock[]>([]);
  const [storesSelected, setStoresSelected] = useState([]);
  const [stockProduct, setStockProduct] = useState([]);

  const toast = useToast();
  const columnsTableInventario: ColumnMeta[] = [
    { field: "attributes.sucursal.data.attributes.nombre", header: "Sucursal" },
    { field: "attributes.cantidad", header: "Cantidad" },
  ];

  const [promotion, setPromotion] = useState({
    descripcion: "",
    fecha_inicio: "2023-11-22T19:47:00.307Z",
    fecha_fin: "2023-11-22T19:47:00.307Z",
    estado: "pendiente",
    procedimiento_aplicar: "N",
  });

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  /*const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0,
  });*/

  const onHandleHide = () => {
    props.onHandleHide();
    setSelectedStoresForDeletion([]);
    setStockProduct([]);
    setStockProductTemp([]);
    setStoresSelected([]);
    //setFacturable(false);
  };

  const handleSaveProduct = () => {
    //Valida que no se ingrese una cantidad de stock mayor a la general
    /* if (product.inventario_fisico < validLimitStock(stockProduct)) {
      toast({
        title: "El stock por sucursal es mayor al stock general",
        status: "warning",
      });
      return;
    }*/
    //product.unidad_de_medida = stock.unidad_de_medida;
    cPromotion.mutate(
      { promotion },
      /*{ product: { data: product }, stock: { data: stock } }*/ {
        onSuccess: async (data) => {
          //queryClient.invalidateQueries(["products"]);
          /*setProduct(initProduct);
          //Guarda el stock de las unidades
          await saveStockProd(
            data.data.id,
            stockProduct,
            product,
            selectedStoresForDeletion
          );*/

          onHandleHide();
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
    setPromotion({ ...promotion, [e.target.name]: e.target.value });
    // setPromotion{{ ...promotion, [e.target.name]: e.target.value }}
    //setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onChangeCalendar = (
    e: any
  ) => {
    console.log(e.value)
    //setPromotion({ ...promotion, [e.target.name]: e.target.value });
    
  };
  /* const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
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
  };*/
  //const [facturable, setFacturable] = useState(false);
  const onUpload = (e: any) => {
    //setProduct({ ...product, [e.target.name]: e.target.files[0] });
  };
  /* useEffect(() => {
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
  }, [product.inventario_fisico]);*/

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
    const restoreStore: any = recuperarCantidad(stockProductTemp, data.value);
    setStockProduct(restoreStore);
  };

  return (
    <Dialog
      style={{ width: "60%" }}
      header=""
      modal
      className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}
    >
      <Stack spacing="2">
        <TabView activeIndex={activeIndex}>
          <TabPanel header="NUEVA PROMOCIÓN" leftIcon="pi pi-fw pi-plus">
            <div className="field">
              <label htmlFor="name">Descripción</label>
              <InputText
                value={promotion.descripcion}
                onChange={onInputTextChange}
                autoFocus
                name="descripcion"
              />
            </div>

    
            <div className="field">
              <label htmlFor="name">Fecha inicio</label>
              <Calendar
                value={promotion.fecha_inicio}
                onChange={(e) => onChangeCalendar(e)}
                //onChange={onInputTextChange}
                name="fecha_inicio"
              />
            </div>

            <div className="field">
              <label htmlFor="name">Fecha Final</label>
              <InputText
                value={promotion.fecha_fin}
                onChange={onInputTextChange}
                name="fecha_fin"
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
        </TabView>
      </Stack>
    </Dialog>
  );
};

export default Promotion;
