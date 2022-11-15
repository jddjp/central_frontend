import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/articulos`)
  return data.data
}

export const postProduct = async (product: any) => {
  const { data } = await axios.post(`${API_URL}/articulos`, product)
  return data
}

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/articulos/${id}`)
  return data.data
}

export const editProduct = async (params: any) => {
  console.log(params.edit)
  const { data } = await axios.put(`${API_URL}/articulos/${params.id}`, params.edit)
  return data.data;
}