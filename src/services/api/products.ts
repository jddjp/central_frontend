import axios from 'axios'
import { useState } from 'react'
const API_URL = process.env.REACT_APP_API_URL


export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/articulos?populate=foto`)
  return data.data
}

export const postProduct = async (product: any) => {
  if (product.data.foto) {
    let file = new FormData();
    file.append("files", product.data.foto, product.data.foto.name);
    axios.post(`${API_URL}/upload/`, file)
      .then((response) => {
        product.data.foto = response.data
        axios({
            method: "post",
            url: `${API_URL}/articulos/`,
            data: product,
                
            })
            .then(({ data }) => {
              return data;
          })
        .catch((error) => {
        //handle error
        });

        })
        .catch((error)=>{
        //handle error
    })  
  } else {
    const { data } = await axios.post(`${API_URL}/articulos`, product)
    return data
  }
}

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/articulos/${id}`)
  return data.data
}

export const editProduct = async (params: any) => {
  if (params.edit.data.foto.slice(0,9) == '/uploads/') {
    console.log(params.edit.data);
    const { data } = await axios.put(`${API_URL}/articulos/${params.id}`, params.edit)
    return data.data;
    
  }else if(params.edit.data.foto){
    let file = new FormData();
    file.append("files", params.edit.data.foto, params.edit.data.foto.name);
    axios.post(`${API_URL}/upload/`, file)
      .then((response) => {
        params.edit.data.foto = response.data
        axios({
            method: "put",
            url: `${API_URL}/articulos/${params.id}`,
            data: params.edit,  
            })
            .then(({ data }) => {
              return data;
          })
        .catch((error) => {
        //handle error
        });

        })
        .catch((error)=>{
        //handle error
    })  
    
  }
  else{
    const { data } = await axios.put(`${API_URL}/articulos/${params.id}`, params.edit)
    return data.data;
  }
}