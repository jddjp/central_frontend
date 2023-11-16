import axios from 'axios';
import { IComprobante, IRequestGetXML, IResponseGetXML, IInvoice } from '../../types/facturacion.sifei';
import { log } from 'console';
import soapRequest from 'easy-soap-request';
import { API_URL } from '../../config/env';
export const createInvoiceSAT = async (requ: IInvoice) => {
    console.log(requ);

    const sendInvoiceResponse = await sendInvoice(requ.requestGeneraXML);
    return sendInvoiceResponse
}

export const sendInvoice = async (request: any): Promise<IResponseGetXML> => {
    let response: IResponseGetXML = {
        status: "",
        codigo: "",
        data: "",
        info: ""
    };
    try {
        const { data } = await axios.post(`${API_URL}/facturacion-sifei`, request)
        if(data.status == "OK"){
            response.status = "Success";
        }else{
            response = data;
        }
    } catch (error) {
        console.error(error);
        return Promise.reject("");
    }
    return Promise.resolve(response);
}
