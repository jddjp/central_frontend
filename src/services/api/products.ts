import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL


export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/articulos?populate=foto`)
  return data.data
}

export const postProduct = async (product: any) => {
  console.log(product.data.foto);

  if(product.data.foto === ""){
    delete product.data.foto;

    const { data } = await axios.post(`${API_URL}/articulos`, product)
    return data

  } else {
    let file = new FormData();
    file.append("files", product.data.foto);
    
    axios.post(`${API_URL}/upload`, file)
    .then((response) => {
      product.data.foto = response.data[0].id

      axios.post(`${API_URL}/articulos`, product)
      .then(({ data }) => {
        return data;
      })
    })
  }
}

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/articulos/${id}`)
  return data.data
}

export const editProduct = async (params: any) => {

  if(params.edit.data.foto === null){
    delete params.edit.data.foto;

    const { data } = await axios.put(`${API_URL}/articulos/${params.id}`, params.edit)
    return data.data;

  } else if(params.edit.data.foto) {
    let file = new FormData();
    file.append("files", params.edit.data.foto);

    axios.post(`${API_URL}/upload/`, file)
    .then((response) => {
      params.edit.data.foto = response.data[0].id

      axios.put(`${API_URL}/articulos/${params.id}`, params.edit )
      .then(({ data }) => {
        return data;
      })
    })  
  }
  
}