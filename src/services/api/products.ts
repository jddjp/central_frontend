import axios from 'axios'
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

      axios.post(`${API_URL}/stocks`, param.stock)
      .then(({data}) => {
        return data
      })
    })

  } 
  // else {
  //   let file = new FormData();
  //   file.append("files", param.product.data.foto);
    
  //   axios.post(`${API_URL}/upload`, file)
  //   .then((response) => {
  //     param.product.data.foto = response.data[0].id

  //     axios.post(`${API_URL}/articulos`, param.product)
  //     .then(({ data }) => {
  //       return data;
  //     })
  //   })
  // }
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