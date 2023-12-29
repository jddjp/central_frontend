export const usuarioModel : TusuarioModel = {
  username: "",
  password: "" ,
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

export const GENEROS = [
  { name: 'Masculino', value: 'masculino' },
  { name: 'Femenino', value: 'femenino' },
];

export const ESTADOS_CIVILES = [
  { name: 'Soltero', value: 'soltero' },
  { name: 'Casado', value: 'casado' },
  { name: 'Divorciado', value: 'divorciado' },
  { name: 'Viudo', value: 'viudo' },
];

export const ROLES = [
  { name: 'Supervisor', value: 'Supervisor' },
  { name: 'Cajero', value: 'Cajero' },
  { name: 'Vendedor', value: 'Vendedor' },
  { name: 'Despachador', value: 'Despachador' },
  { name: 'Librador', value: 'Librador' },
  { name: 'Receptor', value: 'Receptor' },
  { name: 'Contador', value: 'Contador' },
];

export type TusuarioModel = {
  username: string,
  password?: string | undefined,
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  email: "",
  telefono: "",
  sexo: "",
  CURP: "",
  estatus_marital: string,
  fecha_nacimiento: string,
  fecha_contrato: string,
  fecha_termino: string,
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