export const usuarioModel = {
  username: "",
  password: "" || undefined,
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
  blocked: false
};

export type TusuarioModel = {
  username: "",
  password: "",
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  email: "",
  telefono: "",
  sexo: "",
  CURP: "",
  estatus_marital: null,
  fecha_nacimiento: null,
  fecha_contrato: null,
  fecha_termino: null,
  roleCons: "",
  confirmed: true,
  blocked: false
};



export const userCreateTest = {
  "username": "testt",
  "email": "test22@gmail.com",
  "confirmed": true,
  "nombre": "Mario",
  "apellido_paterno": "test",
  "apellido_materno": "test",
  "sexo": "masculino",
  "CURP": null,
  "telefono": null,
  "estatus_marital": null,
  "fecha_nacimiento": null,
  "fecha_contrato": null,
  "fecha_termino": null,
  "roleCons": "Supervisor",
  "password": "123456"
}