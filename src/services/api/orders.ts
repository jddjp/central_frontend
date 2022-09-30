import { appAxios } from 'config/api';
import { IOrderAttributes, Item } from 'types/Order';
export const newOrder = async (payload: IOrderAttributes) => {
    const response = await appAxios.post('/pedidos', {data: { ...payload }});
    return response.data;
}

export const newItem = async (payload: Item) => {
    const response = await appAxios.post('/items', {data: { ...payload.attributes }});
    return response.data;
}

export const getItems = async () => {
    const response = await appAxios.get('/items?populate=articulos');
    return response.data;
}

export const uploadFile = async (selectedFile: File) => {
    let file = new FormData();
    file.append("files", selectedFile);

    const response = await appAxios.post('/upload', file);
    return response.data;
}