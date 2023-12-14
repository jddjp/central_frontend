import { ChangeEvent, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Stack, useToast } from "@chakra-ui/react";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import { Password } from 'primereact/password';
import { usuarioModel } from "models/usuario";
import { createUser, getUser, updateUser } from "services/api/users";

interface PropClientesDetail {
  isVisible: boolean;
  referenceId: number;
  newUsuario: boolean;
  onHandleHide: () => void;
}

const UsuarioModal = (props: PropClientesDetail) => {
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState(usuarioModel);
  const toast = useToast();
  const cUsuario = useMutation(createUser);
  const uUsuario = useMutation(updateUser)
  useQuery(
    ["nuevoUsuario", props.referenceId],
    props.referenceId != 0 ? () => getUser(props.referenceId) : () => { setUsuario(usuarioModel) },
    {
      onSuccess(data: any) {
        if (data != undefined) {
          setUsuario(data.attributes);
        }
      },
    }
  );

  const onHandleHide = () => {
    props.onHandleHide();
  };
  const HandleCreateProduct = async () => {
    if (props.newUsuario) {
      cUsuario.mutate(
        { usuario },
        {
          onSuccess: async () => {
            queryClient.invalidateQueries(["usuarios"]);
            toast({
              status: "success",
              title: "Usuario agregado correctamente",
            });
            onHandleHide();
          },
          onError: async (error: any) => {
            toast({
              status: "error",
              title: error.response.data.error.message,
            });
          }
        }
      );
    }
    else {
      usuario.referenceId = props.referenceId
      uUsuario.mutate({ usuario }, {
        onSuccess: async () => {
          toast({
            status: "success",
            title: "Usuario Actualizado correctamente",
          });
          queryClient.invalidateQueries(["usuarios"]);
          onHandleHide();
        },
        onError: async (error: any) => {
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
        label={props.newUsuario ? "Guardar" : "Actualizar"}
        icon="pi pi-check"
        className="p-button-text"
        onClick={HandleCreateProduct}
      />
    </>
  );

  const onInputTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setUsuario({ ...usuario, [tag]: e.value });
  };

  return (
    <Dialog
      style={{ width: "60%" }}
      header={props.newUsuario ? "Nuevo Cliente" : "Editar Cliente"}
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
              <label htmlFor="name">Nombre Usuario</label>
              <InputText
                value={usuario.username}
                onChange={onInputTextChange}
                autoFocus
                name="username"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Password</label>
            <Password value={usuario.password} 
            onChange={onInputTextChange} 
            feedback={false} tabIndex={1}
            name="password"
            /></div>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                value={usuario.nombre}
                onChange={onInputTextChange}
                autoFocus
                name="nombre"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Apellido Paterno</label>
              <InputText
                value={usuario.apellido_paterno}
                onChange={onInputTextChange}
                autoFocus
                name="apellido_paterno"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Apellido Materno</label>
              <InputText
                value={usuario.apellido_materno}
                onChange={onInputTextChange}
                autoFocus
                name="apellido_materno"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Correo</label>
              <InputText
                value={usuario.email}
                onChange={onInputTextChange}
                required
                name="email"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Municipio</label>
              <InputText
                value={usuario.telefono}
                onChange={onInputTextChange}
                required
                name="telefono"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Estado</label>
              <InputText
                value={usuario.estado}
                onChange={onInputTextChange}
                required
                name="estado"
              />
            </div>
            <div className="field">
              <label htmlFor="name">Cuidad</label>
              <InputText
                value={usuario.ciudad}
                onChange={onInputTextChange}
                required
                name="ciudad"
              />
            </div>
          </TabPanel>
        </TabView>
      </Stack>
    </Dialog>
  );
};

export default UsuarioModal;
