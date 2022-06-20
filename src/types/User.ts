export interface User  {
  CURP?: string,
  apellido_materno: string;
  apellido_paterno: string;
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  email: string;
  estatus_marital?: string;
  fecha_contrato?: string;
  fecha_nacimiento?: string;
  fecha_termino?: string;
  id: number;
  nombre: string;
  provider: string;
  sexo: string;
  telefono?: string;
  updatedAt: string;
  username: string;
}

export function fullName(user: User) {
  return `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`;
}