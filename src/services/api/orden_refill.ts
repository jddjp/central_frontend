
import axios from 'axios'
import { API_URL } from '../../config/env';

export const postOrden = async (param: any) => {
    let data: any;
    data = (await axios.post(`${API_URL}/orden-refills`, {data: param.attributes})).data;
    console.log(data.data.id);
    
    //param.data.id = data.data.id
    return data;
}

export const getOrdenes = async () => {
    //populate=sucursal&populate=unidad_de_medida&populate=articulo&populate[1]=articulo.ruptura_precio&filters[articulo][id]=${id}
    const { data } = await axios.get(`${API_URL}/orden-refills?populate=*`)
    //const { data } = await axios.get(`${API_URL}/stocks?populate[1]=sucursal&populate[2]=unidad_de_medida&populate[3]=articulo.foto&filters[articulo][id]=${id}&filters[sucursal][id]=${sucursal}`)
  
    console.log(data);
  
    if (data.data.length === 0) {
      return {}
    } else {
      return data.data
    }
  }