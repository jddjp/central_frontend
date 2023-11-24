import { Dialog } from "primereact/dialog";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { postOrden } from "services/api/orden_refill";
import useLocalStorage from "hooks/useLocalStorage";
import { UserData } from "services/api/Auth";
import { updateInventarioFisico } from "services/api/products";
import { OrderRefill } from "types/OrderRefil";
import Select, { SingleValue } from "react-select";
import { useQuery, useQueryClient } from "react-query";
import { getSubsidiaries } from "services/api/subsidiary";
import {
  getStockByArticleAndSucursal,
  updateStockSucursal,
} from "services/api/articles";
import { postStock, putStock } from "services/api/stocks";

interface PropOrdenRefill {
  referenceId: number;
  onHandleHide: () => void;
}

export interface AlertOrdenRefill {
  open(articulo_id: number): void;
}
export const authDataKey = "authData";
const OrdenRefill = forwardRef((props: PropOrdenRefill, ref) => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const toast = useToast();
  const [sucursal, setSurcursal] = useState(0);
  const [userData, setUserData] = useLocalStorage<UserData | null>(
    authDataKey,
    null
  );

  const [ordenRefill, setProduct] = useState<OrderRefill>({
    id: 0,
    attributes: {
      cantidad: 0,
      articulo: 0,
    },
  });

  const onHandleHide = () => {
    setIsVisible(false);
    setSurcursal(0);
    ordenRefill.attributes.cantidad = 0
    setProduct({ ...ordenRefill });
    props.onHandleHide();
  };

  const validForm = (): boolean => {
    if (ordenRefill.attributes.cantidad < 1) {
      toast({
        status: "warning",
        title: "Debe ingresar un numero mayor a 0",
      });

      return false;
    }
    if (sucursal == 0) {
      toast({
        status: "warning",
        title: "Seleccione una surcursal",
      });
      return false;
    }

    return true;
  };

  const onSave = async () => {
    setCargando(true)
    if (!validForm()) {
      return;
    }
    try {
      const resultStock = getStockByArticleAndSucursal(
        sucursal,
        ordenRefill.attributes.articulo
      );

      resultStock.then((response: any) => {
        if (response.length == 0) {
          postStock({
            data: {
              cantidad: ordenRefill.attributes.cantidad,
              sucursal: sucursal,
              unidad_de_medida: 2,
              articulo: ordenRefill.attributes.articulo,
            },
          });
        } else {
          const update = updateStockSucursal(
            response[0].attributes.cantidad + ordenRefill.attributes.cantidad,
            response[0].id
          );
        }
        let update = updateInventarioFisico(
          ordenRefill.attributes.articulo,
          ordenRefill.attributes.cantidad
        );
        update.then((response) => {
          let orden = postOrden(ordenRefill);

          orden.then((response) => {
            queryClient.invalidateQueries(["products"]);
            toast({
              status: "success",
              title: "Orden registrada correctamente",
            });
            setCargando(false)
            onHandleHide();
          });
        });
      });
    } catch (error: any) {
      toast({
        status: "error",
        title: "Error al crear la orden",
      });
    }
  };

  useImperativeHandle(ref, () => ({
    open(articulo_id: number) {
      getUser();
      ordenRefill.attributes.articulo = articulo_id;
      ordenRefill.attributes.created__by = userData?.user.id;
      setProduct({ ...ordenRefill });
      setIsVisible(true);
    },
  }));

  const getUser = () => {
    const json = localStorage.getItem("authData");
    if (json !== null) {
      const userDataObj = JSON.parse(json);

      const userData: UserData = {
        jwt: userDataObj.jwt,
        user: userDataObj.user,
      };
      setUserData(userData);
    }
  };

  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    ordenRefill.attributes.cantidad = e.value || 0;
    setProduct({ ...ordenRefill });
  };

  const handleOrigenDistribucion = async (
    option: SingleValue<any>,
    target: string
  ) => {
    if (option) {
      setSurcursal(option.id);
    } else {
      setSurcursal(0);
    }
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
        disabled = {cargando}
        className="p-button-text"
        onClick={onSave}
      />
    </>
  );

  const { data: subsidiaries } = useQuery(["list-subsidiary"], getSubsidiaries);

  return (
    <Dialog
      style={{ width: "30%" }}
      header="Nueva Orden"
      modal
      className="p-fluid"
      visible={isVisible}
      onHide={onHandleHide}
      footer={productDialogFooter}
    >
      <Select
        onChange={(e) => handleOrigenDistribucion(e, "sucursal")}
        isClearable={true}
        menuPosition="fixed"
        placeholder="Buscar sucursal"
        hideSelectedOptions
        key="origen-sucursal"
        options={subsidiaries?.map((subsidiary: any) => {
          return {
            id: subsidiary?.id,
            label: `${subsidiary.attributes?.nombre}`,
          };
        })}
      />
      <Stack spacing="2">
        <div className="field">
          <label htmlFor="name">Cantidad</label>
          <InputNumber
            min={1}
            max={100}
            value={ordenRefill.attributes.cantidad}
            onChange={(e) => onInputNumberChange(e, "attributes.cantidad")}
            required
          />
        </div>
      </Stack>
    </Dialog>
  );
});

export default OrdenRefill;
