
import axios from 'axios'
import { API_URL } from '../../config/env';
import { OrderRefill } from 'types/OrderRefil';

export const postOrden = async (param: any) => {
    let data: any;
    data = (await axios.post(`${API_URL}/orden-refills`, {data: param.attributes})).data;
    console.log(data.data.id);
    
    //param.data.id = data.data.id
    return data;
}