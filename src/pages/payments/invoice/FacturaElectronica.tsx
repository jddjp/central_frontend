import { useState, SetStateAction, Dispatch } from 'react';
import { Box, Input, Stack, Text, useToast } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import { client, getClient, getClients } from 'services/api/cliente';
import { useQuery } from 'react-query';
import { Button } from 'primereact/button';
import { createInvoiceSAT } from 'services/api/facturacion';
import { C_TIPOFACTOR, FormaPago, IInvoice, RegimenesFiscales, TASA_O_CUOTA, TIPO_IMPUESTO, UsosCFDI } from 'types/facturacion.sifei';
import { useLocation, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Grid, GridItem } from '@chakra-ui/react'
import { Cliente } from 'types/Cliente';

import { Dropdown } from 'primereact/dropdown';

export interface ClientInformationProps {
}

const ExistingClient = (props: ClientInformationProps) => {

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [selectedRegimen, setSelectedRegimen] = useState<any>(null);
  const [selectedUsoCfdi, setSelectedUsoCfdi] = useState<any>(null);
  const [selectedFormaPago, setSelectedFormaPago] = useState<any>(null);
  const regimenesFiscales = RegimenesFiscales;
  const usosCFDI = UsosCFDI;
  const formaPago = FormaPago;

  const [user, setUser] = useState<any>();
  const [client, setClient] = useState<Cliente>();
  const { data: clients } = useQuery(["list-client"], getClients)
  const [textValue, setTextValue] = useState({
    name: "",
    firstName: "",
    lastName: ""
  });

  const handleChange = (option: SingleValue<any>) => {
    console.log(option);

    !option ? setUser('') : setUser(option);
    if (option) {
      getDataClient(option.id)
    }
  };


  const onSave = async () => {
    setLoading(true)
    //Se obtiene el detalle del pedido
    const cart = location.state.cart.cart;
    //Se obtiene datos del cliente
    const receptor = await getDataClient(user.id);

    let conceptos: any = [];
    let total: number = 0;
    let subtotal: number = 0;
    let total_iva: number = 0;

    cart.items.map((item: any) => {
      const importeProducto = (item.amount * item.customPrice);
      //const importeProductoIVA = (importeProducto * .16);
      ///const importeProductoIVA = (importeProducto);

      const detalleConceptos = {
        "clave_prod_serv": item.article.attributes.clave_prod_serv,
        "no_identificacion": item.article.id,
        "cantidad": item.amount,
        "clave_unidad":  item.article.attributes.unidad_de_medida.data.attributes.clave_unidad_sa,
        "unidad": item.article.attributes.unidad_de_medida.data.attributes.nombre,
        "descripcion": item.article.attributes.nombre,
        "valor_unitario": round(item.customPrice),
        "importe": round(importeProducto),
        "descuento": "0.00",
        "objeto_impuesto": "01"
      }

      conceptos.push({
        ...detalleConceptos//,
        //Se llena el detalle del total de impuestos por producto
        //"impuestos": {
        //  "traslados":
        //    [{
        //      "base": round(importeProducto),
        //      "impuesto": TIPO_IMPUESTO.IVA,
        //      "tipo_factor": C_TIPOFACTOR.TASA,
        //      "tasa_o_cuota": TASA_O_CUOTA._16,
        //      "importe": round(importeProductoIVA)
        //    }
        //    ]
        //},
      })
      //total += importeProducto + importeProductoIVA;
      total += importeProducto;
      subtotal += importeProducto;
      //total_iva += importeProducto * .16;
      total_iva += importeProducto;
    });
    //Se llena el detalle del total de impuestos
    const impuesto_total: any = {
      "total_impuestos_trasladados": total_iva,
      "traslados": [
        {
          "base": subtotal,
          "impuesto": TIPO_IMPUESTO.IVA,
          "tipo_factor": C_TIPOFACTOR.TASA,
          "tasa_o_cuota": TASA_O_CUOTA._16,
          "importe": total_iva
        }
      ]
    };
    // setLoading(false)
    //return;
    let factura = new IInvoice(getCurrentDate(), selectedFormaPago.id, round(subtotal), round(total),
      receptor, conceptos);

    sendInvoice(factura)
  }


  //Se llena los datos del cliente para la factura
  const getDataClient = async (id: any) => {
    const cliente = await getClient(id);
    setClient(cliente);
    const receptor = {
      "rfc": cliente.attributes.RFC,
      "nombre": cliente.attributes.razon_social,
      "domicilio_fiscal_receptor": cliente.attributes.codigo_postal,
      "regimen_fiscal_receptor": selectedRegimen.id,
      "uso_cfdi": selectedUsoCfdi.id
    };
    return receptor;
  };

  //Se envia a facturar
  const sendInvoice = async (factura: any) => {
    try {
      const response = await createInvoiceSAT(factura);
      setLoading(false)

      if (response.status != "Success") {
        toast({
          status: 'error',
          title: 'Error al crear factura',
          description: 'Ocurrio un error al crear la factura',
        });
        return
      }

      toast({
        status: 'success',
        title: 'Factura creada',
        description: 'La factura fue generada y enviada por correo',
      });
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  const round = (number: number) => {
    return (number).toFixed(2)
  }

  const getCurrentDate = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Se agrega 1 al mes ya que los meses comienzan desde 0
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');

    const fechaFormateada = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
    return fechaFormateada;
  }

  return (
    <Stack w="100%" mx="auto" mb="10" direction="column" spacing="4" mt='3' ml='3' mr='3'>
      <Text fontWeight='bold' fontSize={18}> Cliente</Text>
      <>
        <Select onChange={handleChange} isClearable placeholder='Buscar cliente'
          isDisabled={textValue.name || textValue.firstName || textValue.lastName ? true : false}
          key='normal'
          hideSelectedOptions
          options={clients?.map((client: any) => {
            return {
              id: client?.id,
              label: `${client.attributes?.nombre} ${client.attributes?.apellido_paterno} ${client.attributes?.apellido_materno}`
            }
          })} />
        <Card title="Datos del cliente" >
          <Grid templateColumns='repeat(2, 1fr)' gap={8} mb={10}>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>RFC:</span> {client?.attributes.RFC}</div></GridItem>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>Razon Social:</span> {client?.attributes.razon_social}</div></GridItem>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>Domicilio Fiscal:</span> {client?.attributes.codigo_postal}</div></GridItem>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>Regimen Fiscal:</span>
              <Dropdown value={selectedRegimen} onChange={(e) => setSelectedRegimen(e.value)} options={regimenesFiscales?.map((regimenFiscal: any) => {
                return {
                  id: regimenFiscal.c_RegimenFiscal,
                  name: `${regimenFiscal.Descripcion}`
                }
              })} optionLabel="name" style={{ marginLeft: "15px" }}
                placeholder="Selecciona un regimen fiscal" className="dropdown-small" />
            </div></GridItem>

            <GridItem w='100%' h='57' >
              <div>
                <span style={{ fontWeight: 'bold', opacity: '0.8' }}>Uso CFDI:</span>
                <Dropdown value={selectedUsoCfdi} onChange={(e) => setSelectedUsoCfdi(e.value)} options={usosCFDI?.map((regimenFiscal: any) => {
                  return {
                    id: regimenFiscal.c_UsoCFDI,
                    name: `${regimenFiscal.Descripcion}`
                  }
                })} optionLabel="name" style={{ marginLeft: "15px" }}
                  placeholder="Selecciona el uso CFDI" className="dropdown-small" />
              </div>
            </GridItem>

            <GridItem w='100%' h='57' >
              <div>
                <span style={{ fontWeight: 'bold', opacity: '0.8' }}>Forma de pago:</span>
                <Dropdown value={selectedFormaPago} onChange={(e) => setSelectedFormaPago(e.value)} options={formaPago?.map((regimenFiscal: any) => {
                  return {
                    id: regimenFiscal.c_FormaPago,
                    name: `${regimenFiscal.Descripcion}`
                  }
                })} optionLabel="name" style={{ marginLeft: "15px" }}
                  placeholder="Selecciona una forma de pago" className="dropdown-small" />
              </div>
            </GridItem>
          </Grid>
        </Card>

        <Box h='40px'>
          <Button label="Confirmar" loading={loading} icon="pi pi-check" className="p-button p-button-success" style={{ marginLeft: 'auto', display: 'block' }} onClick={onSave} />
        </Box>
      </>

    </Stack>
  );
}

export default ExistingClient
