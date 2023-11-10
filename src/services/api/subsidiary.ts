import axios from 'axios'
import { API_URL } from '../../config/env';

export const getSubsidiaries = async () => {
  const { data } = await axios.get(`${API_URL}/sucursales`)

  return data.data
}

export const getBodegas = async () => {
  const { data } = await axios.get(`${API_URL}/bodegas`)

  return data.data
}

export const getStockBySucursal = async (articleId: number) => {
  const sucursalStorage = localStorage.getItem('sucursal')
  const { data } = await axios.get(`${API_URL}/articulos/${articleId}?populate=stocks&populate=stocks.sucursal&populate=stocks.unidad_de_medida`)
  const result = data.data.attributes.stocks.data.find((stock: any) =>
    stock.attributes.sucursal.data.id === Number(sucursalStorage) && stock
  )
  return result
}