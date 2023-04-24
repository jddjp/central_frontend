import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL


export const getPromotions = async () => {
  const { data } = await axios.get(`${API_URL}/upload/files`)
  return data
}

export const uploadMedia = async () => {

}