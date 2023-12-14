import { ChangeEvent, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Stack, Text, useToast } from "@chakra-ui/react";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import { createSucursal, getSucursal, updateSucursal } from "services/api/articles";
import { sucursalModel } from "models/sucursal";

interface PropSucursalDetail {
  isVisible: boolean;
  referenceId: number;
  newSucursal: boolean;
  onHandleHide: () => void;
}

const SucusalesDetail = (props: PropSucursalDetail) => {
  const queryClient = useQueryClient();
  const [sucursal, setSucursal] = useState(sucursalModel);
  const toast = useToast();
  const createS = useMutation(createSucursal);
  const updateS = useMutation(updateSucursal)
  useQuery(
    ["nuevaSucursal", props.referenceId],
    props.referenceId != 0 ? () => getSucursal(props.referenceId) : () => {setSucursal(sucursalModel)},
    {
      onSuccess(data: any) {
        if (data != undefined) {
          setSucursal(data.attributes);
        }
      },
    }
  );

  const onHandleHide = () => {
    props.onHandleHide();
  };
  const HandleCreateProduct = async () => {
    if (props.newSucursal) {
      createS.mutate(
        { sucursal },
        {
          onSuccess: async () => {
            queryClient.invalidateQueries(["sucursalesCatalogue"]);
            toast({
              status: "success",
              title: "Sucursal Agregada correctamente",
            });
            onHandleHide();
          },
        }
      );
    }
    else{
      sucursal.referenceId = props.referenceId
      updateS.mutate({sucursal},{
        onSuccess: async () => {
          toast({
            status: "success",
            title: "Sucursal Actualizada correctamente",
          });
           queryClient.invalidateQueries(["sucursalesCatalogue"]);
           onHandleHide();
         },
      })
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
        label={props.newSucursal ? "Guardar" : "Actualizar"}
        icon="pi pi-check"
        className="p-button-text"
        onClick={HandleCreateProduct}
      />
    </>
  );

  const onInputTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSucursal({ ...sucursal, [e.target.name]: e.target.value });
  };
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setSucursal({ ...sucursal, [tag]: e.value });
  };

  return (
    <Dialog
      style={{ width: "60%" }}
      header="Nueva Sucursal"
      modal
      className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}
    >
      <Stack spacing="1rem">
        <TabView>
          <TabPanel header="SUCURSAL" leftIcon="pi pi-fw pi-home">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                value={sucursal.nombre}
                onChange={onInputTextChange}
                autoFocus
                name="nombre"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Calle</label>
              <InputText
                value={sucursal.calle}
                onChange={onInputTextChange}
                name="calle"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Colonia</label>
              <InputText
                value={sucursal.colonia}
                onChange={onInputTextChange}
                name="colonia"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Numero Exterior</label>
              <InputText
                value={sucursal.numero_exterior}
                onChange={onInputTextChange}
                required
                name="numero_exterior"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Numero Interior</label>
              <InputText
                value={sucursal.numero_interior}
                onChange={onInputTextChange}
                required
                name="numero_interior"
              />
            </div>
            <div className="field">
              <label htmlFor="name">C.P.</label>
              <InputNumber
                value={sucursal.codigo_postal}
                onChange={(e: any) => onInputNumberChange(e, "codigo_postal")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="name">Municipio</label>
              <InputText
                value={sucursal.municipio}
                onChange={onInputTextChange}
                required
                name="municipio"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Estado</label>
              <InputText
                value={sucursal.estado}
                onChange={onInputTextChange}
                required
                name="estado"
              />
            </div>
            <br></br>
            <Text as="b">DATOS DE FACTURACIÓN</Text>
            <div className="field">
              <label htmlFor="name">RFC EMISOR</label>
              <InputText
                value={sucursal.rfc_emisor}
                onChange={onInputTextChange}
                required
                name="rfc_emisor"
              />
            </div>
            <div className="field">
              <label htmlFor="name">NOMBRE FISCAL</label>
              <InputText
                value={sucursal.nombre_fiscal_emisor}
                onChange={onInputTextChange}
                required
                name="nombre_fiscal_emisor"
              />
            </div>
            <div className="field">
              <label htmlFor="name">REGIMEN FISCAL</label>
              <InputText
                value={sucursal.regimen_fiscal_emisor}
                onChange={onInputTextChange}
                required
                name="regimen_fiscal_emisor"
              />
            </div>
          </TabPanel>
        </TabView>
      </Stack>
    </Dialog>
  );
};

export default SucusalesDetail;
