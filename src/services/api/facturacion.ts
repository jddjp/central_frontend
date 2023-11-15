import axios from 'axios';
import { IComprobante, IRequestGetXML, IResponseGetXML, IInvoice } from '../../types/facturacion.sifei';
import { log } from 'console';
import soapRequest from 'easy-soap-request';
import { API_URL } from '../../config/env';
export const createInvoiceSAT = async (requ: IInvoice) => {
    console.log(requ);

    const sendInvoiceResponse = await sendInvoice(requ.requestGeneraXML);
    console.log(sendInvoiceResponse);
    return sendInvoiceResponse
}

export const sendInvoice = async (request: any): Promise<IResponseGetXML> => {
    let response: IResponseGetXML;
    try {
        const { data } = await axios.post(`${API_URL}/facturacion-sifei`, request)
        response = data;
        console.log(data);
        response.status = "Success";
    } catch (error) {
        console.error(error);
        return Promise.reject("");
    }
    return Promise.resolve(response);
}
