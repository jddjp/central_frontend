import axios from 'axios'
import { IOrderAttributes, Item } from 'types/Order';
import { discountStock } from './stocks';
import { API_URL } from '../../config/env';

export const newOrder = async (payload: IOrderAttributes) => {
    const response = await axios.post(`${API_URL}/pedidos`, {data: { ...payload }});
    return response.data;
}

export const newItem = async (payload: Item) => {
    axios.post(`${API_URL}/items`, {data: { ...payload.attributes }})
    .then(async () => {
        const response = await discountStock({id: payload.attributes.articulos, cantidad: payload.attributes.cantidad})
        return response.data
    })
}

export const getItems = async () => {
    const response = await axios.get(`${API_URL}/items?populate=articulos`);
    return response.data;
}

export const uploadFile = async (selectedFile: File) => {
    let file = new FormData();
    file.append("files", selectedFile);

    const response = await axios.post(`${API_URL}/upload`, file);
    return response.data;
}

export const getOrderEntregado = async () => {
    const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[estatus]=entregado`)
    return data.data
}

export const getOrderPendiente = async () => {
    const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[estatus]=pendiente&populate=articulos`)
    return data.data
}

export const getOrderDistribution = async () => {
    const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[distribution]=true&populate=articulos`)
    console.log("======================================")
    console.log(data)
    return data.data
}

export const putCliente = async (params: any) => {
    console.log(params);
    delete params.update.data.articulos
    delete params.update.data.fecha
    delete params.update.data.hora 
    const { data } = await axios.put(`${API_URL}/clientes/${params.id}`, params.update)
    return data.data;
}

export const deleteOrder = async (id: number) => {
    const response = await axios.delete(`${API_URL}/pedidos/${id}`);
    return response.data;
}

export const extractFlagOrders = async () => {
    const { data } = await axios.get(`${API_URL}/pedidos?populate=*`)

    return data.data
}

export const getOrdersPending = async () => {
    const { data } = await axios.get(`${API_URL}/pedidos?filters[estatus]=pendiente&populate=*`)

    return data.data
}