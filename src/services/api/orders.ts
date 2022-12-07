import axios from 'axios'
import { IOrderAttributes, Item } from 'types/Order';
const API_URL = process.env.REACT_APP_API_URL

export const newOrder = async (payload: IOrderAttributes) => {
    console.log(payload);
    const response = await axios.post(`${API_URL}/pedidos`, {data: { ...payload }});
    return response.data;
}

export const newItem = async (payload: Item) => {
    const response = await axios.post(`${API_URL}/items`, {data: { ...payload.attributes }});
    return response.data;
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
    const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[estatus]=pendiente`)
    return data.data
}

export const deleteOrder = async (id: number) => {
    const response = await axios.delete(`${API_URL}/pedidos/${id}`);
    return response.data;
}

export const extractFlagOrders = async () => {
    const { data } = await axios.get(`${API_URL}/pedidos?populate=*`)

    return data.data
}