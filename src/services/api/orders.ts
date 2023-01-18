import axios from 'axios'
import { IOrderAttributes, Item } from 'types/Order';
const API_URL = process.env.REACT_APP_API_URL

export const newOrder = async (payload: IOrderAttributes) => {
    console.log(payload);
    const response = await axios.post(`${API_URL}/pedidos`, {data: { ...payload }});
    return response.data;
}

export const newItem = async (payload: Item) => {
    console.log(payload.attributes.unidad_de_medida);
    const response = await axios.post(`${API_URL}/items`, {data: { ...payload.attributes }});
    console.log(response.data);
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
    const { data } = await axios.get(`${API_URL}/pedidos?populate=cliente&filters[estatus]=pendiente&populate=articulos`)
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
