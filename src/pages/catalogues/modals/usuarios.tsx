import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Stack, useToast } from "@chakra-ui/react";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import { Password } from 'primereact/password';
import { TusuarioModel, usuarioModel } from "models/usuario";
import { createUser, getUser, updateUser } from "services/api/users";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { FormikTouched, useFormik } from "formik";
import { classNames } from "primereact/utils";

import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';


interface PropClientesDetail {
  isVisible: boolean;
  referenceId: number;
  newUsuario: boolean;
  onHandleHide: () => void;
}

const UsuarioModal = (props: PropClientesDetail) => {
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | Date[] | undefined>(undefined);
  const [fechaContrato, setFechaContrato] = useState<Date | Date[] | undefined>(undefined);
  const [fechaTermino, setFechaTermino] = useState<Date | Date[] | undefined>(undefined);

  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState(usuarioModel);
  const toast = useToast();
  const cUsuario = useMutation(createUser);
  const uUsuario = useMutation(updateUser);

  const [loading, setLoading] = useState(false);
  const generos = [
    { name: 'Masculino', value: 'masculino' },
    { name: 'Femenino', value: 'femenino' },
  ];

  const estadosCiviles = [
    { name: 'Soltero', value: 'soltero' },
    { name: 'Casado', value: 'casado' },
    { name: 'Divorciado', value: 'divorciado' },
    { name: 'Viudo', value: 'viudo' },
  ];

  const roles = [
    { name: 'Supervisor', value: 'Supervisor' },
    { name: 'Cajero', value: 'Cajero' },
    { name: 'Vendedor', value: 'Vendedor' },
    { name: 'Despachador', value: 'Despachador' },
    { name: 'Librador', value: 'Librador' },
    { name: 'Receptor', value: 'Receptor' },
    { name: 'Contador', value: 'Contador' },
  ];

  const formik = useFormik({
    initialValues: usuarioModel,
    validate: (data: any) => {
      let errors = {
        username: "",
        password: "",
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        telefono: "",
        sexo: "",
        CURP: "",
        estatus_marital: "",
        fecha_nacimiento: "",
        fecha_contrato: "",
        fecha_termino: "",
        roleCons: "",
        confirmed: true,
      }

      let containError = false;

      if (!data.username) {
        errors.username = 'Nombre de usuario requerido';
        containError = true;
      }
      if (!data.password && props.newUsuario) {
        errors.password = 'Contrasena requerido';
        containError = true;
      }

      if (formik.values.password && validarContrasena(data.password) != "") {
        errors.password = validarContrasena(formik.values.password);
        containError = true;
      }
      if (!data.nombre) {
        errors.nombre = 'Nombre requerido';
        containError = true;
      }
      if (!data.apellido_paterno) {
        errors.apellido_paterno = 'Apellido paterno requerido';
        containError = true;
      }
      if (!data.apellido_materno) {
        errors.apellido_materno = 'Apellido materno requerido';
        containError = true;
      }
      if (!data.email) {
        errors.email = 'Correo requerido';
        containError = true;
      }
      if (!data.telefono) {
        errors.telefono = 'Telefono requerido';
        containError = true;
      }
      if (!data.CURP) {
        errors.CURP = 'Curp requerido';
        containError = true;
      }
      if (!data.sexo) {
        errors.sexo = 'Sexo requerido';
        containError = true;
      }
      if (!data.estatus_marital) {
        errors.estatus_marital = 'Estado civil requerido';
        containError = true;
      }
      if (!data.roleCons) {
        errors.roleCons = 'Rol requerido';
        containError = true;
      }

      if (!containError) {
        return {}
      }

      return errors;
    },
    onSubmit: async (data) => {
      setLoading(true);
      formik.values.fecha_nacimiento = (fechaNacimiento) ? getFechaACadena(fechaNacimiento) : "";
      formik.values.fecha_contrato = (fechaContrato) ? getFechaACadena(fechaContrato) : "";
      formik.values.fecha_termino = (fechaTermino) ? getFechaACadena(fechaTermino) : "";
      await HandleCreateProduct();
    }
  });

  useQuery(
    ["nuevoUsuario", props.referenceId],
    props.referenceId != 0 ? () => getUser(props.referenceId) : () => { setUsuario(usuarioModel) },
    {
      onSuccess(data: TusuarioModel) {
        if (data != undefined) {
          formik.values.username = data.username;
          formik.values.nombre = (data.nombre == null) ? "" : data.nombre;
          formik.values.apellido_paterno = (data.apellido_paterno == null) ? "" : data.apellido_paterno;
          formik.values.apellido_materno = (data.apellido_materno == null) ? "" : data.apellido_materno;
          formik.values.email = (data.email == null) ? "" : data.email;
          formik.values.sexo = (data.sexo == null) ? "" : data.sexo;
          formik.values.CURP = (data.CURP == null) ? "" : data.CURP;
          formik.values.estatus_marital = (data.estatus_marital == null) ? "" : data.estatus_marital;
          formik.values.roleCons = (data.roleCons == null) ? "" : data.roleCons;
          formik.values.telefono = (data.telefono == null) ? "" : data.telefono;
          formik.values.fecha_nacimiento = (data.fecha_nacimiento == null) ? "" : data.fecha_nacimiento;
          if (data.fecha_nacimiento != null) {
            setFechaNacimiento(convertirCadenaAFecha(data.fecha_nacimiento))
          }
          formik.values.fecha_contrato = (data.fecha_contrato == null) ? "" : data.fecha_contrato;
          if (data.fecha_contrato != null) {
            setFechaContrato(convertirCadenaAFecha(data.fecha_contrato))
          }
          formik.values.fecha_termino = (data.fecha_termino == null) ? "" : data.fecha_termino;
          if (data.fecha_termino != null) {
            setFechaTermino(convertirCadenaAFecha(data.fecha_termino))
          }
        }
      },
    }
  );

  const convertirCadenaAFecha = (cadenaFecha: string) => {
    // Dividir la cadena de fecha en año, mes y día
    const [anio, mes, dia] = cadenaFecha.split('-').map(Number);

    // El mes en JavaScript es 0-indexado, por lo que restamos 1 al mes
    const fecha = new Date(anio, mes - 1, dia);

    return fecha;
  }

  const getFechaACadena = (fecha: any) => {
    const anio = fecha.getFullYear();
    // El mes se devuelve en formato 0-indexado, por lo que sumamos 1 al mes
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');

    const cadenaFecha = `${anio}-${mes}-${dia}`;
    return cadenaFecha;
  }

  const onHandleHide = () => {
    setLoading(false);
    formik.values.username = "";
    formik.values.nombre = "";
    formik.values.apellido_paterno = "";
    formik.values.apellido_materno = "";
    formik.values.email = "";
    formik.values.sexo = "";
    formik.values.CURP = "";
    formik.values.estatus_marital = "";
    formik.values.roleCons = "";
    formik.values.telefono = "";
    formik.values.fecha_nacimiento = "";
    formik.values.fecha_contrato = "";
    formik.values.fecha_termino = "";
    setFechaContrato(undefined)
    setFechaNacimiento(undefined)
    setFechaTermino(undefined)
    props.onHandleHide();
  };
  const HandleCreateProduct = async () => {
    const dataUser = formik.values;
    if (props.newUsuario) {
      await cUsuario.mutate(
        { usuario: dataUser },
        {
          onSuccess: async () => {
            queryClient.invalidateQueries(["usuarios"]);
            toast({
              status: "success",
              title: "Usuario agregado correctamente",
            });
            onHandleHide();
            formik.resetForm();
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
      await uUsuario.mutate({ usuario: dataUser, id: props.referenceId }, {
        onSuccess: async () => {
          toast({
            status: "success",
            title: "Usuario Actualizado correctamente",
          });
          queryClient.invalidateQueries(["usuarios"]);
          onHandleHide();
          formik.resetForm();
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
        type="submit"
        onClick={() => formik.handleSubmit()}
        loading={loading}
      />
    </>
  );

  const onInputTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    formik.setFieldValue(e.target.name, e.target.value);
  };

  const onInputDropdownChange = (e: DropdownChangeEvent, tag: string) => {
    formik.setFieldValue(tag, e.target.value);
  };

  const onInputNacimientoChange = (data: any) => {
    setFechaNacimiento(data)
  };
  const onInputContratoChange = (data: any) => {
    setFechaContrato(data)
  };
  const onInputTerminoChange = (data: any) => {
    setFechaTermino(data)
  };

  const validarContrasena = (contrasena: string) => {
    // Verificar si la longitud de la contraseña es al menos 6 caracteres
    if (contrasena.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return '';
  }

  return (
    <Dialog
      style={{ width: "60%" }}
      header={props.newUsuario ? "Nuevo Usuario" : "Editar Usuario"}
      modal
      className="p-fluid"
      visible={props.isVisible}
      footer={productDialogFooter}
      onHide={onHandleHide}
      onShow={() => formik.resetForm()}
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
        <Stack spacing="1rem">
          <TabView>
            <TabPanel header="DATOS" leftIcon="pi pi-fw pi-user">
              <div className="p-fluid grid formgrid">
                <div className="field col-12 md:col-4">
                  <label htmlFor="name">Nombre Usuario*</label>
                  <InputText
                    value={formik.values.username}
                    onChange={onInputTextChange}
                    autoFocus
                    name="username"
                    className={classNames({ 'p-invalid': !!(formik.touched.username && formik.errors.username) })}
                  />
                  {!!(formik.touched.username && formik.errors.username) ? <small className="p-error">{formik.errors.username}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="name">Correo*</label>
                  <InputText
                    value={formik.values.email}
                    onChange={onInputTextChange}
                    required
                    name="email"
                    className={classNames({ 'p-invalid': !!(formik.touched.email && formik.errors.email) })}
                  />
                  {!!(formik.touched.email && formik.errors.email) ? <small className="p-error">{formik.errors.email}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="name">Password*</label>
                  <Password value={formik.values.password}
                    onChange={onInputTextChange}
                    feedback={false} tabIndex={1}
                    name="password"
                    className={classNames({ 'p-invalid': !!(formik.touched.password && formik.errors.password) })}
                  />
                  {!!(formik.touched.password && formik.errors.password) ? <small className="p-error">{formik.errors.password}</small> : <small className="p-error">&nbsp;</small>}</div>
                <div className="field col-12 md:col-3">
                  <label htmlFor="name">Nombre*</label>
                  <InputText
                    value={formik.values.nombre}
                    onChange={onInputTextChange}
                    autoFocus
                    name="nombre"
                    className={classNames({ 'p-invalid': !!(formik.touched.nombre && formik.errors.nombre) })}
                  />
                  {!!(formik.touched.nombre && formik.errors.nombre) ? <small className="p-error">{formik.errors.nombre}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field field col-12 md:col-3">
                  <label htmlFor="name">Apellido Paterno*</label>
                  <InputText
                    value={formik.values.apellido_paterno}
                    onChange={onInputTextChange}
                    autoFocus
                    name="apellido_paterno"
                    className={classNames({ 'p-invalid': !!(formik.touched.apellido_paterno && formik.errors.apellido_paterno) })}
                  />
                  {!!(formik.touched.apellido_paterno && formik.errors.apellido_paterno) ? <small className="p-error">{formik.errors.apellido_paterno}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-3">
                  <label htmlFor="name">Apellido Materno*</label>
                  <InputText
                    value={formik.values.apellido_materno}
                    onChange={onInputTextChange}
                    autoFocus
                    name="apellido_materno"
                    className={classNames({ 'p-invalid': !!(formik.touched.apellido_materno && formik.errors.apellido_materno) })}
                  />
                  {!!(formik.touched.apellido_materno && formik.errors.apellido_materno) ? <small className="p-error">{formik.errors.apellido_materno}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-3">
                  <label htmlFor="name">Telefono*</label>
                  <InputText
                    value={formik.values.telefono}
                    onChange={onInputTextChange}
                    required
                    name="telefono"
                    className={classNames({ 'p-invalid': !!(formik.touched.telefono && formik.errors.telefono) })}
                  />
                  {!!(formik.touched.telefono && formik.errors.telefono) ? <small className="p-error">{formik.errors.telefono}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="name">CURP*</label>
                  <InputText
                    value={formik.values.CURP}
                    onChange={onInputTextChange}
                    required
                    name="CURP"
                    className={classNames({ 'p-invalid': !!(formik.touched.CURP && formik.errors.CURP) })}
                  />
                  {!!(formik.touched.CURP && formik.errors.CURP) ? <small className="p-error">{formik.errors.CURP}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="name">Sexo*</label>
                  <Dropdown value={formik.values.sexo} onChange={(e) => onInputDropdownChange(e, 'sexo')} options={generos} optionLabel="name"
                    placeholder="Seleccionar genero"
                    className={classNames({ 'p-invalid': !!(formik.touched.sexo && formik.errors.sexo), 'w-full': true })} />
                  {!!(formik.touched.sexo && formik.errors.sexo) ? <small className="p-error">{formik.errors.sexo}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="name">Estado civil*</label>
                  <Dropdown value={formik.values.estatus_marital} onChange={(e) => onInputDropdownChange(e, 'estatus_marital')} options={estadosCiviles} optionLabel="name"
                    placeholder="Seleccionar estado civil"
                    className={classNames({ 'p-invalid': !!(formik.touched.estatus_marital && formik.errors.estatus_marital), 'w-full': true })} />
                  {!!(formik.touched.estatus_marital && formik.errors.estatus_marital) ? <small className="p-error">{formik.errors.estatus_marital}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="basic">Fecha Nacimiento</label>
                  <Calendar id="basic" value={fechaNacimiento} onChange={(e) => onInputNacimientoChange(e.value)} dateFormat="yy-mm-dd" />
                  {!!(formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento) ? <small className="p-error">{formik.errors.fecha_nacimiento}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="basic">Fecha Contrato</label>
                  <Calendar id="basic" value={fechaContrato} onChange={(e) => onInputContratoChange(e.value)} dateFormat="yy-mm-dd" />
                  {!!(formik.touched.fecha_contrato && formik.errors.fecha_contrato) ? <small className="p-error">{formik.errors.fecha_contrato}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="basic">Fecha Termino</label>
                  <Calendar id="basic" value={fechaTermino} onChange={(e) => onInputTerminoChange(e.value)} dateFormat="yy-mm-dd" />
                  {!!(formik.touched.fecha_termino && formik.errors.fecha_termino) ? <small className="p-error">{formik.errors.fecha_termino}</small> : <small className="p-error">&nbsp;</small>}
                </div>
                <div className="field col-12 md:col-3">
                  <label htmlFor="name">Tipo usuario*</label>
                  <Dropdown value={formik.values.roleCons} onChange={(e) => onInputDropdownChange(e, 'roleCons')} options={roles} optionLabel="name"
                    placeholder="Seleccionar tipo de usuario"
                    className={classNames({ 'p-invalid': !!(formik.touched.roleCons && formik.errors.roleCons), 'w-full': true })} />
                  {!!(formik.touched.roleCons && formik.errors.roleCons) ? <small className="p-error">{formik.errors.roleCons}</small> : <small className="p-error">&nbsp;</small>}
                </div>
              </div>
            </TabPanel>
          </TabView>

        </Stack>
      </form>
    </Dialog>
  );
};

export default UsuarioModal;
