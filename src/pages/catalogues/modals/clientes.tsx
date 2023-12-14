import { ChangeEvent, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Stack, useToast } from "@chakra-ui/react";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import { clienteModel } from "models/cliente";
import { createCliente, getCliente, updateCliente } from "services/api/cliente";

interface PropClientesDetail {
  isVisible: boolean;
  referenceId: number;
  newCliente: boolean;
  onHandleHide: () => void;
}

const ClientesModal = (props: PropClientesDetail) => {
  const queryClient = useQueryClient();
  const [cliente, setCliente] = useState(clienteModel);
  const toast = useToast();
  const cCliente = useMutation(createCliente);
  const uCliente = useMutation(updateCliente)
  useQuery(
    ["nuevaSucursal", props.referenceId],
    props.referenceId != 0 ? () => getCliente(props.referenceId) : () => {setCliente(clienteModel)},
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
      cCliente.mutate(
        { cliente },
        {
          onSuccess: async () => {
            queryClient.invalidateQueries(["clientes"]);
            toast({
              status: "success",
              title: "Cliente agregado correctamente",
            });
            onHandleHide();
          },
          onError: async (error:any) => {
            toast({
              status: "error",
              title: error.response.data.error.message,
            });
          }
        }
      );
    }
    else{
      cliente.referenceId = props.referenceId
      uCliente.mutate({cliente},{
        onSuccess: async () => {
          toast({
            status: "success",
            title: "Cliente Actualizado correctamente",
          });
           queryClient.invalidateQueries(["clientes"]);
           onHandleHide();
         },
         onError: async (error:any) => {
          toast({
            status: "error",
            title: error.response.data.error.message,
          });
        }
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
              <label htmlFor="name">Apellido Paterno</label>
              <InputText
                value={cliente.apellido_paterno}
                onChange={onInputTextChange}
                autoFocus
                name="apellido_paterno"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Apellido Materno</label>
              <InputText
                value={cliente.apellido_materno}
                onChange={onInputTextChange}
                autoFocus
                name="apellido_materno"
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
              <label htmlFor="name">RFC</label>
              <InputText
                value={cliente.RFC}
                onChange={onInputTextChange}
                required
                name="RFC"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Correo</label>
              <InputText
                value={cliente.correo}
                onChange={onInputTextChange}
                required
                name="correo"
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
                value={cliente.telefono}
                onChange={onInputTextChange}
                required
                name="telefono"
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
            <div className="field">
              <label htmlFor="name">Cuidad</label>
              <InputText
                value={cliente.ciudad}
                onChange={onInputTextChange}
                required
                name="ciudad"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Razon Social</label>
              <InputText
                value={cliente.razon_social}
                onChange={onInputTextChange}
                
                name="razon_social"
              />
            </div>
          </TabPanel>
        </TabView>
      </Stack>
    </Dialog>
  );
};

export default ClientesModal;
