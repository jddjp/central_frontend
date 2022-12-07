import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

export const extractStock = async (id: number) => {
  const { data } = await axios.get(`${API_URL}/stocks?populate=*`)

  const finded = data.data.find((stock: any) => id === stock?.attributes?.articulo?.data?.id)
  
  if (finded) {
    return {
      stock: finded.attributes.cantidad,
      medida: finded.attributes.unidad_de_medida.data.attributes.nombre
    }
  } else {
    return {
      stock: 0,
      medida: ''
    }
  }
}