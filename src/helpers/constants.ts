const initProduct = {
  nombre: '',
  precio_lista: 0,
  marca: '',
  inventario_fiscal: 0,
  inventario_fisico: 0,
  descripcion: "",
  categoria: "",
  codigo_barras: "",
  codigo_qr: "",
  estado: "",
  peso: "",
  foto: "",
  iva :0,
  isFiscal: false,
  isFisical: false,
  fresh: true,
  unidad_de_medida: 0,
  isFacturable: false
  // cantidad_stock:0,
}

const initStock = {
  cantidad: 0,
  sucursal: 0,
  unidad_de_medida: 0
}

const estado = [{ name: 'bueno', value: 'bueno' }];

const categoria = [
  { name: 'Semilla', value: 'Semilla' },
  { name: 'Granos', value: 'Granos' },
  { name: 'Especias molidas', value: 'Especias molidas' },
  { name: 'Abarrotes', value: 'Abarrotes' },
  { name: 'Frutos secos', value: 'Frutos secos' }
];

const unidadMedida = [{ name: 'kg', value: 2 },{ name: 'litros', value: 1 }];

export { initProduct, initStock, estado, categoria, unidadMedida }