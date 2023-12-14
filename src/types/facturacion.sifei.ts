export enum TIPO_IMPUESTO {
    IVA = "002",
    Ninguno = "NA"
};

export enum C_TIPOFACTOR {
    TASA = "Tasa"
}

export enum TASA_O_CUOTA {
    _16 = "0.160000"
}

export interface RequestToken {
    rfc: string,
    password: ""
}

export interface ISFDI {
    requestGeneraXML: IRequestGetXML
}
export interface IRequestGetXML {
    email?: string ,
    id_pedido: number ,
    id_client: number,
    id_sucursal: number,
    comprobante: IComprobante,
    configuracion?: IConfiguracion
}
export interface IResponseGetXML {
    status: string,
    codigo: string,
    data: string,
    info: string
}

export class IInvoice implements ISFDI {
    requestGeneraXML: IRequestGetXML

    constructor(email: string | undefined,id_pedido: number, id_client: number, id_sucursal: number, fecha: string, forma_pago: string, subtotal: any, total: any,
        receptor: Receptor, conceptos: Concepto[]
        , impuestos?: Impuestos2
    ) {
        this.requestGeneraXML = {
            email: email,
            id_pedido: id_pedido,
            id_client: id_client,
            id_sucursal: id_sucursal,
            comprobante: {
                version: "4.0",
                serie: "A",
                //folio: "1",
                fecha: fecha,
                forma_pago: forma_pago,
                //condiciones_de_pago: "validador",
                subtotal: subtotal,
                descuento: "0.00",
                moneda: "MXN",
                tipo_cambio: "1",
                total: total,
                tipo_de_comprobante: "I",
                exportacion: "01",
                metodo_pago: "PUE",
                //lugar_expedicion: "72010",
                // cfdi_relacionados: cfdi_relacionados,
                receptor: receptor,
                conceptos: conceptos,
                impuestos: impuestos,
            },
        }

    }
}



export interface IComprobante {
    version?: string
    serie?: string
    folio?: string
    fecha: string
    forma_pago: string
    condiciones_de_pago?: string
    subtotal: string
    descuento?: string
    moneda?: string
    tipo_cambio?: string
    total: string
    tipo_de_comprobante?: string
    exportacion?: string
    metodo_pago?: string
    //lugar_expedicion?: string
    cfdi_relacionados?: CfdiRelacionado[]
    //emisor: Emisor
    receptor: Receptor
    conceptos: Concepto[]
    impuestos?: Impuestos2,
}

export interface CfdiRelacionado {
    tipo_relacion: string
    cfdi_relacionado: CfdiRelacionado2[]
}

export interface CfdiRelacionado2 {
    uuid: string
}

export interface Emisor {
    rfc: string
    nombre: string
    regimen_fiscal: string
}

export interface Receptor {
    rfc: string
    nombre: string
    domicilio_fiscal_receptor: string
    regimen_fiscal_receptor: string
    uso_cfdi: string
}

export interface Concepto {
    clave_prod_serv: string
    no_identificacion: string
    cantidad: string
    clave_unidad: string
    unidad: string
    descripcion: string
    valor_unitario: string
    importe: string
    descuento: string
    objeto_impuesto: string
    impuestos?: Impuestos
    informacion_aduanera?: InformacionAduanera[]
    cuenta_predial?: CuentaPredial[]
    parte?: Parte[]
}

export interface Impuestos {
    traslados: Traslado[]
}

export interface Traslado {
    base: string
    impuesto: string
    tipo_factor: string
    tasa_o_cuota: string
    importe: string
}

export interface InformacionAduanera {
    numero_pedimento: string
}

export interface CuentaPredial {
    numero: string
}

export interface Parte {
    clave_prod_serv: string
    no_identificacion: string
    cantidad: string
    unidad: string
    descripcion: string
    valor_unitario: string
    importe: string
    informacion_aduanera?: InformacionAduanera2[]
}

export interface InformacionAduanera2 {
    numero_pedimento: string
}

export interface Impuestos2 {
    total_impuestos_trasladados: string
    traslados: Traslado2[]
}

export interface Traslado2 {
    base: string
    impuesto: string
    tipo_factor: string
    tasa_o_cuota: string
    importe: string
}

export interface IConfiguracion {
    validador: IValidador,
    csd: ICSD
}

export interface IValidador {
    valida_xml: boolean,
    valida_timbre: boolean
}

export interface ICSD {
    cer: string,
    key: string,
    clave: string
}

export const RegimenesFiscales = [
    {
        "c_RegimenFiscal": 601,
        "Descripcion": "General de Ley Personas Morales",
        "Fisica": "No",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 603,
        "Descripcion": "Personas Morales con Fines no Lucrativos",
        "Fisica": "No",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 605,
        "Descripcion": "Sueldos y Salarios e Ingresos Asimilados a Salarios",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 606,
        "Descripcion": "Arrendamiento",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 607,
        "Descripcion": "Régimen de Enajenación o Adquisición de Bienes",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 608,
        "Descripcion": "Demás ingresos",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 610,
        "Descripcion": "Residentes en el Extranjero sin Establecimiento Permanente en México",
        "Fisica": "Sí",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 611,
        "Descripcion": "Ingresos por Dividendos (socios y accionistas)",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 612,
        "Descripcion": "Personas Físicas con Actividades Empresariales y Profesionales",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 614,
        "Descripcion": "Ingresos por intereses",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 615,
        "Descripcion": "Régimen de los ingresos por obtención de premios",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 616,
        "Descripcion": "Sin obligaciones fiscales",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 620,
        "Descripcion": "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
        "Fisica": "No",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 621,
        "Descripcion": "Incorporación Fiscal",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 622,
        "Descripcion": "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
        "Fisica": "No",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 623,
        "Descripcion": "Opcional para Grupos de Sociedades",
        "Fisica": "No",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 624,
        "Descripcion": "Coordinados",
        "Fisica": "No",
        "Moral": "Sí",
    },
    {
        "c_RegimenFiscal": 625,
        "Descripcion": "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
        "Fisica": "Sí",
        "Moral": "No",
    },
    {
        "c_RegimenFiscal": 626,
        "Descripcion": "Régimen Simplificado de Confianza",
        "Fisica": "Sí",
        "Moral": "Sí",
    }
]

export const USOS_CFDI = [
    {
        "c_UsoCFDI": "G01",
        "Descripcion": "Adquisición de mercancías.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "G02",
        "Descripcion": "Devoluciones, descuentos o bonificaciones.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 616, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "G03",
        "Descripcion": "Gastos en general.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I01",
        "Descripcion": "Construcciones.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I02",
        "Descripcion": "Mobiliario y equipo de oficina por inversiones.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I03",
        "Descripcion": "Equipo de transporte.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I04",
        "Descripcion": "Equipo de computo y accesorios.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I05",
        "Descripcion": "Dados, troqueles, moldes, matrices y herramental.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I06",
        "Descripcion": "Comunicaciones telefónicas.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I07",
        "Descripcion": "Comunicaciones satelitales.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "I08",
        "Descripcion": "Otra maquinaria y equipo.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
    },
    {
        "c_UsoCFDI": "D01",
        "Descripcion": "Honorarios médicos, dentales y gastos hospitalarios.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D02",
        "Descripcion": "Gastos médicos por incapacidad o discapacidad.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D03",
        "Descripcion": "Gastos funerales.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D04",
        "Descripcion": "Donativos.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D05",
        "Descripcion": "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D06",
        "Descripcion": "Aportaciones voluntarias al SAR.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D07",
        "Descripcion": "Primas por seguros de gastos médicos.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D08",
        "Descripcion": "Gastos de transportación escolar obligatoria.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D09",
        "Descripcion": "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "D10",
        "Descripcion": "Pagos por servicios educativos (colegiaturas).",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605, 606, 608, 611, 612, 614, 607, 615, 625"
    },
    {
        "c_UsoCFDI": "S01",
        "Descripcion": "Sin efectos fiscales.",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626"
    },
    {
        "c_UsoCFDI": "CP01",
        "Descripcion": "Pagos",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "SÍ",
        "RegimenFiscalReceptor": "601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626"
    },
    {
        "c_UsoCFDI": "CN01",
        "Descripcion": "Nómina",
        "PersonaFisica": "SÍ",
        "PersonaMoral": "NO",
        "RegimenFiscalReceptor": "605"
    }
]

export const FORMA_PAGO = [
    {
      "c_FormaPago": "01",
      "Descripcion": "Efectivo"
    },
    {
      "c_FormaPago": "02",
      "Descripcion": "Cheque nominativo"
    },
    {
      "c_FormaPago": "03",
      "Descripcion": "Transferencia electrónica de fondos"
    },
    {
      "c_FormaPago": "04",
      "Descripcion": "Tarjeta de crédito"
    },
    {
      "c_FormaPago": "05",
      "Descripcion": "Monedero electrónico"
    },
    {
      "c_FormaPago": "06",
      "Descripcion": "Dinero electrónico"
    },
    {
      "c_FormaPago": "08",
      "Descripcion": "Vales de despensa"
    },
    {
      "c_FormaPago": "12",
      "Descripcion": "Dación en pago"
    },
    {
      "c_FormaPago": "13",
      "Descripcion": "Pago por subrogación"
    },
    {
      "c_FormaPago": "14",
      "Descripcion": "Pago por consignación"
    },
    {
      "c_FormaPago": "15",
      "Descripcion": "Condonación"
    },
    {
      "c_FormaPago": "17",
      "Descripcion": "Compensación"
    },
    {
      "c_FormaPago": "23",
      "Descripcion": "Novación"
    },
    {
      "c_FormaPago": "24",
      "Descripcion": "Confusión"
    },
    {
      "c_FormaPago": "25",
      "Descripcion": "Remisión de deuda"
    },
    {
      "c_FormaPago": "26",
      "Descripcion": "Prescripción o caducidad"
    },
    {
      "c_FormaPago": "27",
      "Descripcion": "A satisfacción del acreedor"
    },
    {
      "c_FormaPago": "28",
      "Descripcion": "Tarjeta de débito"
    },
    {
      "c_FormaPago": "29",
      "Descripcion": "Tarjeta de servicios"
    },
    {
      "c_FormaPago": "30",
      "Descripcion": "Aplicación de anticipos"
    },
    {
      "c_FormaPago": "31",
      "Descripcion": "Intermediario pagos"
    },
    {
      "c_FormaPago": "99",
      "Descripcion": "Por definir"
    }
  ]