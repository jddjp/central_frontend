import { appAxios } from 'config/api';
import { IOrderAttributes, Items } from 'types/Order';

export const newOrder = async (payload: IOrderAttributes) => {
    const response = await appAxios.post('/pedidos', {data: { ...payload }});
    return response.data;
}

export const newItem = async (payload: Items) => {
    const response = await appAxios.post('/items', {data: { ...payload }});
    return response.data;
}