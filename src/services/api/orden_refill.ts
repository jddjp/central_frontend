
import axios from 'axios'
import { API_URL } from '../../config/env';
import { OrderRefill } from 'types/OrderRefil';
import Strapi from 'strapi-sdk-js';
import { baseUrl } from 'config/api';
const strapi = new Strapi({ url: baseUrl });

export const postOrden = async (param: any) => {
  const data = (await strapi.create<OrderRefill>('orden-refills', param.attributes)).data
  return data;
}