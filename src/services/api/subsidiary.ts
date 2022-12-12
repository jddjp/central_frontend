import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

export const getSubsidiaries = async () => {
  const { data } = await axios.get(`${API_URL}/sucursales`)

  return data.data.map((subsiduary: any) => {
    return {
      value: subsiduary.id,
      name: subsiduary.attributes.nombre
    }
  })
}