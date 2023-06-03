import axios from 'axios'
import { API_URL } from '../../config/env';

export const getPromotions = async () => {
  const { data } = await axios.get(`${API_URL}/upload/files`)
  return data
}

export const uploadMedia = async () => {

}