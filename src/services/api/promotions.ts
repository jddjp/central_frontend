import axios from 'axios'
const API_URL = 'http://54.165.25.186:1380/api'


export const getPromotions = async () => {
  const { data } = await axios.get(`${API_URL}/upload/files`)
  return data
}

export const uploadMedia = async () => {

}