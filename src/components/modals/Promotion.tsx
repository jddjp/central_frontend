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

const Promotion = (props: PropsPromotionDetail) => {
  const queryClient = useQueryClient();
  const cPromotion = useMutation(createPromotion);
  const [promotion, setPromotion] = useState({
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "pendiente",
    foto:"",
    procedimiento_aplicar: "N",
  });
  const toast = useToast();
  const onHandleHide = () => {
    props.onHandleHide();
  };

  const handleSavePromotion = () => {

    if(promotion.foto == ""){
      toast({
        title: "Para crear una nueva promoción se debe subir una imagen",
        status: "error",
      });
      return
    }
    cPromotion.mutate(
      { promotion },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(["promotions"]);
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
        onClick={handleSavePromotion}
      />
    </>
  );

  const onInputTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPromotion({ ...promotion, [e.target.name]: e.target.value });
  };

  const onChangeCalendar = (
    e: any
  ) => {
    setPromotion({ ...promotion, ['fecha_inicio']: e.value });
  };

  const onChangeCalendarFin = (
    e: any
  ) => {
    setPromotion({ ...promotion, ['fecha_fin']: e.value });
  }
  const onUpload = (e: any) => {
    setPromotion({ ...promotion, [e.target.name]: e.target.files[0] });
  }

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
        <TabView>
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
                dateFormat="dd/mm/yy"
                onChange={(e) => onChangeCalendar(e) }
                name="fecha_inicio"
              />
            </div>

            <div className="field">
              <label htmlFor="name">Fecha Final</label>
              <Calendar
                value={promotion.fecha_fin}
                dateFormat="dd/mm/yy"
                onChange={(e) => onChangeCalendarFin(e) }
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
