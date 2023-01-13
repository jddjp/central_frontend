import axios from 'axios'
import { deleteProduct } from './products'
const API_URL = process.env.REACT_APP_API_URL

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

  if (extract.data.data.length !== 0) {
    axios.delete(`${API_URL}/stocks/${extract.data.data[0].id}`)
    .then(() => {
      deleteProduct(id)
    })
  } else {
    deleteProduct(id)
  }
}

export const postStock = async (stockData: any) => {
  const { data } = await axios.post(`${API_URL}/stocks`, stockData)
  return data
}

export const updateStock = async (id: number, stockData: any) => {
  const extract = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)
  console.log(extract.data.data[0].id, stockData);
  const { data } = await axios.put(`${API_URL}/stocks/${extract.data.data[0].id}`, stockData)
  return { data }
}

export const extractUnidad = async (id: number) => {
  const { data } = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)

  return data.data[0].attributes.unidad_de_medida.data.id
}