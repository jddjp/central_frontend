import axios from "axios";
import { API_URL } from "config/env";

export const deleteRuptura = async (id: number) => {
  const { data } = await axios.delete(`${API_URL}/rupturaprecios/${id}`);
  return data;
};

export const postRuptura = async (param: any) => {
  let data: any;
  data = (await axios.post(`${API_URL}/rango-ruptura-precios`, param)).data;
  return data;
};
