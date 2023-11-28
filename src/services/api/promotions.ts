import axios from 'axios'
import { API_URL } from '../../config/env';

export const getPromotions = async () => {
  const { data } = await axios.get(`${API_URL}/promociones?populate=articulo&populate=foto`)
  return data.data
}

export const uploadMedia = async () => {

}

export const deletePromotion = async (id: number) => {
  const data = axios.delete(`${API_URL}/promociones/${id}`)
  return data

}

export const createPromotion = async (param: any) => {
  let data = {data : param.promotion}
    data = (await axios.post(`${API_URL}/promociones`, data)).data;
  return data;
}