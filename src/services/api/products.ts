import axios from 'axios'
import { postStock, updateStock } from './stocks'
const API_URL = process.env.REACT_APP_API_URL


export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/articulos?populate=foto`)
  return data.data
}

export const postProduct = async (param: any) => {

  console.log(param);

  if(param.product.data.foto === ""){
    delete param.product.data.foto;

    axios.post(`${API_URL}/articulos`, param.product)
    .then(({data}) => {
      param.stock.data.articulo = data.data.id

      postStock(param.stock)
    })

  } else {
    const file = new FormData();
    file.append("files", param.product.data.foto);
    
    axios.post(`${API_URL}/upload`, file)
    .then((response) => {
      param.product.data.foto = response.data[0].id

      axios.post(`${API_URL}/articulos`, param.product)
      .then(({ data }) => {
        param.stock.data.articulo = data.data.id

        postStock(param.stock)
      })
    })
  }
}

export const deleteProduct = async (id: number) => {
  const { data } = await axios.delete(`${API_URL}/articulos/${id}`)
  return data.data
}

export const editProduct = async (param: any) => {

  console.log(param.edit, param.id);

  if(!param.edit.data.foto){
    delete param.edit.data.foto;

    axios.put(`${API_URL}/articulos/${param.id}`, param.edit)
    .then(() => {
      updateStock(param.id, param.stock)
    })

  } else if(param.edit.data.foto) {
    let file = new FormData();
    file.append("files", param.edit.data.foto);

    axios.post(`${API_URL}/upload`, param.edit.foto)
    .then((response) => {
      param.edit.data.foto = response.data[0].id

      axios.put(`${API_URL}/articulos/${param.id}`, param.edit )
    })  
  }
  
}

export const getProductById = async (id: number) => {
  const { data } = await axios.get(`${API_URL}/stocks?populate=*&filters[articulo][id]=${id}`)
  
  if(data.data.length === 0) {
    return {}
  } else {
    return data.data[0].attributes
  }
}