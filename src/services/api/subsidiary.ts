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