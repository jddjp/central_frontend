import axios from 'axios'
const API_URL = 'http://54.165.25.186:1380/api'

export const getSubsidiaries = async () => {
  const { data } = await axios.get(`${API_URL}/sucursales`)

  return data.data
}

export const getBodegas = async () => {
  const { data } = await axios.get(`${API_URL}/bodegas`)

  return data.data
}