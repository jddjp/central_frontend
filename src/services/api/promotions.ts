import axios from 'axios'
import { API_URL } from '../../config/env';

export const getPromotions = async () => {
  const { data } = await axios.get(`${API_URL}/promociones?populate=articulo`)
  console.log(data.data)
  return data.data
}

export const uploadMedia = async () => {

}

export const createPromotion = async (param: any) => {
  //let data: any;
  console.log(param)
  let data = {data : param.promotion}
 

    data = (await axios.post(`${API_URL}/promociones`, data)).data;
  
  return data;
}