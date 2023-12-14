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

interface PropClientesDetail {
  isVisible: boolean;
  referenceId: number;
  newCliente: boolean;
  onHandleHide: () => void;
}

const ClientesModal = (props: PropClientesDetail) => {
  const queryClient = useQueryClient();
  const [cliente, setCliente] = useState(sucursalModel);
  const toast = useToast();
  const createS = useMutation(createSucursal);
  const updateS = useMutation(updateSucursal)
  useQuery(
    ["nuevaSucursal", props.referenceId],
    props.referenceId != 0 ? () => getSucursal(props.referenceId) : () => {setCliente(sucursalModel)},
    {
      onSuccess(data: any) {
        if (data != undefined) {
          setCliente(data.attributes);
        }
      },
    }
  );

  const onHandleHide = () => {
   props.onHandleHide();
  };
  const HandleCreateProduct = async () => {
    if (props.newCliente) {
      createS.mutate(
        { cliente },
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
      cliente.referenceId = props.referenceId
      updateS.mutate({cliente},{
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
        label={props.newCliente ? "Guardar" : "Actualizar"}
        icon="pi pi-check"
        className="p-button-text"
        onClick={HandleCreateProduct}
      />
    </>
  );

  const onInputTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setCliente({ ...cliente, [tag]: e.value });
  };

  return (
    <Dialog
      style={{ width: "60%" }}
      header={props.newCliente ? "Nuevo Cliente" : "Editar Cliente"}
      modal
      className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}
    >
      <Stack spacing="1rem">
        <TabView>
          <TabPanel header="CLIENTE" leftIcon="pi pi-fw pi-user">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                value={cliente.nombre}
                onChange={onInputTextChange}
                autoFocus
                name="nombre"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Calle</label>
              <InputText
                value={cliente.calle}
                onChange={onInputTextChange}
                name="calle"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Colonia</label>
              <InputText
                value={cliente.colonia}
                onChange={onInputTextChange}
                name="colonia"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Numero Exterior</label>
              <InputText
                value={cliente.numero_exterior}
                onChange={onInputTextChange}
                required
                name="numero_exterior"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Numero Interior</label>
              <InputText
                value={cliente.numero_interior}
                onChange={onInputTextChange}
                required
                name="numero_interior"
              />
            </div>
            <div className="field">
              <label htmlFor="name">C.P.</label>
              <InputNumber
                value={cliente.codigo_postal}
                onChange={(e: any) => onInputNumberChange(e, "codigo_postal")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="name">Municipio</label>
              <InputText
                value={cliente.municipio}
                onChange={onInputTextChange}
                required
                name="municipio"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Estado</label>
              <InputText
                value={cliente.estado}
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
                value={cliente.rfc_emisor}
                onChange={onInputTextChange}
                required
                name="rfc_emisor"
              />
            </div>
            <div className="field">
              <label htmlFor="name">NOMBRE FISCAL</label>
              <InputText
                value={cliente.nombre_fiscal_emisor}
                onChange={onInputTextChange}
                required
                name="nombre_fiscal_emisor"
              />
            </div>
            <div className="field">
              <label htmlFor="name">REGIMEN FISCAL</label>
              <InputText
                value={cliente.regimen_fiscal_emisor}
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

export default ClientesModal;
