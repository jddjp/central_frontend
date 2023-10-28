import axios from 'axios'
import { deleteProduct } from './products'
import { API_URL } from '../../config/env';

export const extractStock = async (id: number) => {
  const { data } = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)
  console.log(data);
  
  if (data) {
    return {
      stock: data.data[0].attributes.cantidad,
      medida: data.data[0].attributes.unidad_de_medida.data.attributes.nombre,
      medidaId: data.data[0].attributes.unidad_de_medida.data.id,
      sucursal: data.data[0].attributes.sucursal.data.id
    }
  } else {
    return {
      stock: 0,
      medida: '',
      medidaId: 0,
      sucursal: 0
    }
  }
}

export const deleteStock = async (id: number) => {
  const extract = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)

  return new Promise((resolve, reject) => {
    if (extract.data.data.length !== 0) {
      axios.delete(`${API_URL}/stocks/${extract.data.data[0].id}`)
      .then(() => {
        deleteProduct(id)
        .then((data) => {
          resolve(data)
        })
      })
    } else {
      deleteProduct(id)
      .then((data) => {
        resolve(data)
      })
    }
  })

}

export const deleteStockById = async (id: number) => {
  const data = await axios.delete(`${API_URL}/stocks/${id}`)
  return data
}

export const postStock = async (stockData: any) => {
  const { data } = await axios.post(`${API_URL}/stocks`, stockData)
  return data
}

export const putStock = async (id: number, stockData: any) => {
  const extract = await axios.get(`${API_URL}/stocks/${id}`)
  console.log("putStock");
  console.log(extract);
  const { data } = await axios.put(`${API_URL}/stocks/${extract.data.data.id}`, stockData)
  return { data }
}

export const updateStock = async (id: number, stockData: any) => {
  const extract = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)
  console.log(extract.data.data[0].id, stockData);
  const { data } = await axios.put(`${API_URL}/stocks/${extract.data.data[0].id}`, stockData)
  return { data }
}

export const discountStock = async (data: { id: number, cantidad: number }) => {
  const sucursalStorage = localStorage.getItem('sucursal')
  const extract = await axios.get(`${API_URL}/articulos/${data.id}?populate=stocks&populate=stocks.sucursal&populate=stocks.unidad_de_medida`)

  const result = extract.data.data.attributes.stocks.data.find((stock: any) =>
    stock.attributes.sucursal.data.id === Number(sucursalStorage) && stock
  )

  let restante = result.attributes.cantidad - data.cantidad
  let restante_inventario_fisico = extract.data.data.attributes.inventario_fisico - data.cantidad

  await axios.put(`${API_URL}/articulos/${data.id}`, { data: { inventario_fisico: restante_inventario_fisico }})
  const response = await axios.put(`${API_URL}/stocks/${result.id}`, {data: { cantidad: restante }})


  return response.data
};

export const sumStock = async (id: number | undefined, stock: number) => {

  const extract = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)
  // console.log(extract.data.data[0].id, stockData);
  let sum = extract.data.data[0].attributes.cantidad + stock
  const { data } = await axios.put(`${API_URL}/stocks/${extract.data.data[0].id}`, { data: { cantidad: sum}})
  return { data }
};

export const extractUnidad = async (id: number) => {
  const { data } = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)

  return data.data[0].attributes.unidad_de_medida.data.id
}

export const getStock = async (id_prod: number, id_unidad: any) => {
  const { data } = await axios.get(`${API_URL}/stocks?filters[articulo][id]=${id_prod}&filters[sucursal][id]=${id_unidad}`)

  return data
}