import React, { useState, SetStateAction, Dispatch, useRef, useEffect } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, Input, Stack, Text, textDecoration, useToast } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import { client, getClient, getClients } from 'services/api/cliente';
import { useQuery } from 'react-query';
import { Button } from 'primereact/button';
import { createInvoiceSAT } from 'services/api/facturacion';
import { C_TIPOFACTOR, FORMA_PAGO, IInvoice, RegimenesFiscales, TASA_O_CUOTA, TIPO_IMPUESTO, USOS_CFDI } from 'types/facturacion.sifei';
import { useLocation, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Grid, GridItem } from '@chakra-ui/react'
import { Cliente } from 'types/Cliente';

import { Dropdown } from 'primereact/dropdown';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import NotaPrint from 'pages/orders/CreateOrderPage/NotaSimple/NotaPrint';
import { useReactToPrint } from 'react-to-print';
import { useTicketDetail } from "../../../zustand/useTicketDetails";
import { DataScroller } from 'primereact/datascroller';

import { ProductService } from 'services/ProductService';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { BASE_URL } from 'config/env';
import ProductoSustitutos from './ProductosSustitutos'
import { pricingCalculator } from 'helpers/pricingCalculator';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

export interface ClientInformationProps {
}

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

const ExistingClient = (props: ClientInformationProps) => {
  // Constantes y Variables de Estado
  const location = useLocation();
  
  const [displaySimpleNote, setDisplaySimpleNote] = useState(false);
  //Datos resumen
  const [total, setTotal] = useState("0.00");
  const [subtotal, setSubtotal] = useState("0.00");
  const [importeIVA, setImporteIVA] = useState("0.00");

  const [needReplace, setNeedReplace] = useState(true);
  const { detail } = useTicketDetail();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [cart, setCart] = useState<any>([]);


  // Estados para selecciones y datos
  const [selectedRegimen, setSelectedRegimen] = useState<any>(null);
  const [selectedUsoCfdi, setSelectedUsoCfdi] = useState<any>(null);
  const [selectedFormaPago, setSelectedFormaPago] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [client, setClient] = useState<Cliente>();
  const { data: clients } = useQuery(["list-client"], getClients)
  const [textValue, setTextValue] = useState({
    name: "",
    firstName: "",
    lastName: ""
  });

  const boxNote = useRef<HTMLDivElement>(null);

  const handleChange = (option: SingleValue<any>) => {
    !option ? setUser('') : setUser(option);
    if (option) {
      getDataClient(option.id)
    }
  };

  const validSustituto = (_cart: any) => {
    let valid = true;
    setNeedReplace(false);

    _cart.map((item: any) => {
      console.log(item.product.article.attributes.isFacturable);
      if (item.sustituto == null && item.product.article.attributes.isFacturable == false) {
        valid = false;
        setNeedReplace(true);
      }

    })
    return valid;
  };

  const redondearDosDecimales = (numero: any) => {
    var amount = 0.0;
    amount = Math.round(numero * 100) / 100;
    return amount;
  }

  const validEnvio = () => {
    let valid = true;
    let message = "";
    console.log(user);

    if (user == null) {
      valid = false;
      message = 'Debe seleccionar un cliente a quien se le facturara.'
      toast({ status: 'error', title: 'Informacion invalida', description: message });
      return valid;
    }

    if (!selectedUsoCfdi) {
      valid = false;
      message = 'Debe seleccionar un uso de cfdi.'
      toast({ status: 'error', title: 'Informacion invalida', description: message });
      return valid;
    }

    if (!selectedRegimen) {
      valid = false;
      message = 'Debe seleccionar un regimen fiscal.'
      toast({ status: 'error', title: 'Informacion invalida', description: message });
      return valid;
    }

    if (!selectedFormaPago) {
      valid = false;
      message = 'Debe seleccionar una forma de pago.'
      toast({ status: 'error', title: 'Informacion invalida', description: message });
      return valid;
    }


    valid = true;
    return valid
  }

  const resumenInvoice = (_cart: any) => {

    let _total: number = 0;

    let _subtotal: number = 0;
    let _total_iva: number = 0;
    let containTaxClasification = false;
    _cart.map((item: any) => {
      if (item.product.article.attributes.iva == 16) {
        containTaxClasification = true;
      }

      let importeProducto : any = (item.product.amount * item.product.customPrice);
      if (item.sustituto != null) {
        const importe  = (item.product.amount * item.product.priceBroken) / pricingCalculator(
          //item.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rangos,
          item.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
          item.product.amount
        ).price;
        console.log("....");
        
        
        importeProducto = round(importe * pricingCalculator(
          //item.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rangos,
          item.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
          item.product.amount
        ).price);
        
      }


      _total += importeProducto;
      _subtotal += importeProducto;

      //Se agrega el objeto del detalle del impuesto por producto
      if (containTaxClasification) {
        const importeProductoIVA = Number(importeProducto * (item.product.article.attributes.iva / 100));
        _total_iva += importeProductoIVA;
        _total = Number(_total) + Number(importeProductoIVA);
        
        console.log(importeProductoIVA);
        console.log(_total);
      }
    });
    setTotal(round(_total));
    setImporteIVA(round(_total_iva));
    setSubtotal(round(_subtotal))
  }

  const onSave = async () => {
    if (!validSustituto(cart)) {
      toast({ status: 'error', title: 'Aviso', description: "Debe sustituir los productos que nos son facturables." });
      return;
    }

    //formik.handleSubmit()
    if (!validEnvio()) {
      return;
    }
    setLoading(true)
    //Se obtiene el detalle del pedido
    const cart_ = location.state.cart.cart;
    //Se obtiene datos del cliente
    const receptor = await getDataClient(user.id);

    let conceptos: any = [];
    //let total: number = 0;
    //let subtotal: number = 0;
    //let total_iva: number = 0;
    let containTaxClasification = false;


    cart.map((item: any) => {
      let detalleConceptos;
      if (item.product.article.attributes.iva == 16) {
        containTaxClasification = true;
      }
      const importeProducto = (item.product.amount * item.product.customPrice);

      detalleConceptos = {
        "clave_prod_serv": item.sustituto == null ? item.product.article.attributes.clave_prod_serv : item.sustituto.attributes.articulo.data.attributes.clave_prod_serv,
        "no_identificacion": item.sustituto == null ? item.product.article.id : item.sustituto.attributes.articulo.data.id,
        "cantidad": item.sustituto == null ? item.product.amount : round((item.product.amount * item.product.priceBroken) / pricingCalculator(item.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data, item.product.amount).price),
        "clave_unidad": item.sustituto == null ? item.product.article.attributes.unidad_de_medida.data.attributes.clave_unidad_sat : item.sustituto.attributes.articulo.data.attributes.unidad_de_medida.data.attributes.clave_unidad_sat,
        "unidad": item.sustituto == null ? item.product.article.attributes.unidad_de_medida.data.attributes.nombre : item.sustituto.attributes.articulo.data.attributes.unidad_de_medida.data.attributes.nombre,
        "descripcion": item.sustituto == null ? item.product.article.attributes.nombre : item.sustituto.attributes.articulo.data.attributes.nombre,
        "valor_unitario": item.sustituto == null ? round(item.product.customPrice) : pricingCalculator(item.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data, item.product.amount).price,
        "importe": round(importeProducto),
        "descuento": "0.00",
        "objeto_impuesto": "01"
      }

      //total += importeProducto;
      //subtotal += importeProducto;

      //Se agrega el objeto del detalle del impuesto por producto
      if (containTaxClasification) {
        const importeProductoIVA = (importeProducto * (item.product.article.attributes.iva / 100));
        //total_iva += importeProductoIVA;
        //total += importeProductoIVA;

        detalleConceptos.objeto_impuesto = "02";
        detalleConceptos = {
          ...detalleConceptos,
          //Detalle del total de impuestos
          "impuestos": {
            "traslados":
              [{
                "base": round(importeProducto),
                "impuesto": TIPO_IMPUESTO.IVA,
                "tipo_factor": C_TIPOFACTOR.TASA,
                "tasa_o_cuota": TASA_O_CUOTA._16,
                "importe": round(importeProductoIVA)
              }
              ]
          },
        }
      }

      conceptos.push({ ...detalleConceptos })
    });

    let factura;
    if (!containTaxClasification) {
      factura = new IInvoice(client?.attributes.correo, location.state.cart.cart.id_pedido, 
        location.state.cart.client.id, location.state.cart.sucursal.id, 
        getCurrentDate(), selectedFormaPago.id, round(Number(subtotal)), round(Number(total)),
        receptor, conceptos);
    }
    if (containTaxClasification) {

      //Se llena el detalle del total de impuestos
      const impuesto_total: any = {
        "total_impuestos_trasladados": importeIVA,
        "traslados": [
          {
            "base": subtotal,
            "impuesto": TIPO_IMPUESTO.IVA,
            "tipo_factor": C_TIPOFACTOR.TASA,
            "tasa_o_cuota": TASA_O_CUOTA._16,
            "importe": importeIVA
          }
        ]
      };
      console.log(total);
      
      factura = new IInvoice(client?.attributes.correo, location.state.cart.cart.id_pedido,
        location.state.cart.client.id, location.state.cart.sucursal.id, getCurrentDate(),
         selectedFormaPago.id,round(Number(subtotal)), round(Number(total)),
        receptor, conceptos, impuesto_total);
    }

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
      console.log(response);


      if (response.status != "Success") {
        toast({
          status: 'error',
          title: 'Error al crear factura',
          description: JSON.stringify(response.status),
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
    return (Math.round(number * 100) / 100).toFixed(2);
}

  const opentSimpleNote = (name: any) => {
    setDisplaySimpleNote(true);
  };

  const handlePrint = useReactToPrint({
    content: () => boxNote.current
  });

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

  const renderFooter = (name: any) => {
    return (
      <div>

        <Button outlined severity="secondary"
          onClick={() => setDisplaySimpleNote(false)}
        >Cancelar</Button>
        <Button icon="pi pi-print" severity="success" label='Imprimir'
          onClick={handlePrint}
        ></Button>
      </div>
    );
  };

  const [products, setProducts] = useState<Product[]>([]);

  const _handleRemplazar = (product: any, sustituto: any) => {
    console.log("+++++++++++++++++++++++++++");
    console.log(sustituto);
    
    
    const newArrayDeObjetos = cart.map((item: any) => {
      if (item.product.article.id === product.article.id) {
        return { product: item.product, sustituto: sustituto }
      }
      // Mantén los otros objetos sin cambios
      return item;
    })
    setCart(newArrayDeObjetos);
    validSustituto(newArrayDeObjetos);
    resumenInvoice(newArrayDeObjetos);
  }

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data));
    let cartTemp: any = [];
    location.state.cart.cart.items.map((item: any) => {
      const newItem = { product: item, sustituto: null }
      cartTemp.push(newItem);


    })
    setCart(cartTemp)
    validSustituto(cartTemp);
    resumenInvoice(cartTemp);
    
  console.log(location.state);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSeverity = (product: Product) => {
    switch (product.inventoryStatus) {
      case 'NO_FACTURABLE':
        return 'warning';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  };

  const itemTemplate = (data: any) => {
    return (
      <div className="col-12 sssss">

        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          {data.sustituto == null &&
            (<img className="w-9 sm:w-16rem xl:w-10rem xl:h-10rem shadow-2 block xl:block mx-auto border-round p-0 " style={{ objectFit: 'cover' }} src={`${BASE_URL}${data?.product.article?.attributes?.foto.data?.attributes?.url}`} alt={data.name} />)
          }
          {data.sustituto != null &&
            (<img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round p-0" src={`${BASE_URL}${data.sustituto.attributes.articulo.data.attributes?.foto.data?.attributes?.url}`} alt={data.name} />)
          }
          <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
            <div className="flex flex-column align-items-center lg:align-items-start gap-3">
              <div className="flex flex-column gap-1">
                <div className="text-2xl font-bold text-900">
                  <span style={{ textDecorationLine: data.sustituto != null ? 'line-through' : 'none' }}>{data?.product.article?.attributes?.nombre}</span>
                  {data.sustituto != null &&
                    <span className='ml-2'>{data.sustituto.attributes.articulo.data.attributes.nombre}</span>
                  }
                </div>
                <div className="text-700">
                  <span style={{ textDecorationLine: data.sustituto != null ? 'line-through' : 'none' }}>{`${data.product.amount} x $${data.product.priceBroken}`}</span>
                  {data.sustituto != null &&
                    <span className='ml-2'>{`${round((data.product.amount * data.product.priceBroken) / pricingCalculator(
                      //data.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rangos,
                      data.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
                      //data.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
                      data.product.amount
                    ).price)} x $${pricingCalculator(
                      data.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
                      data.product.amount
                    ).price}`}</span>
                  }

                </div>
              </div>
            </div>
            <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
              <span className="text-2xl font-semibold">
                {data.sustituto == null &&
                  `$${data.product.priceBroken! * data.product.amount}`
                }
                {data.sustituto != null &&
                  `${round((data.product.amount * data.product.priceBroken) / pricingCalculator(
                    data.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
                    data.product.amount
                  ).price * pricingCalculator(
                    data.sustituto.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
                    data.product.amount
                  ).price) }`
                }
              </span>
              {data?.product.article?.attributes?.isFacturable == false &&
                (
                  <>

                    <ProductoSustitutos usar={_handleRemplazar} producto={data.product} cart={cart}></ProductoSustitutos>

                    {data.sustituto == null &&
                      <Tag className="mr-2 bg-orange-500 text-white" icon="pi pi-info-circle" value="No facturable"></Tag>
                    }
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  const titleCardCliente = () => {
    return (
      <><i className="pi pi-user" style={{ fontSize: '1.3rem' }}></i> Datos del cliente</>
    )
  }

  const titleCardPedido = () => {
    return (
      <><i className="pi pi-shopping-cart" style={{ fontSize: '1.3rem' }}></i> Pedido</>
    )
  }

  return (
    <Stack w="100%" mx="auto" mb="10" direction="column" spacing="4" mt='3' ml='3' mr='3'>
      <Text fontWeight='bold' fontSize={30}> Factura Electronica</Text>
      <>
        <Select onChange={handleChange} isClearable placeholder='Busca y selecciona un cliente a quien facturar'
          isDisabled={textValue.name || textValue.firstName || textValue.lastName ? true : false}
          key='normal'
          hideSelectedOptions
          options={clients?.map((client: any) => {
            return {
              id: client?.id,
              label: `${client.attributes?.nombre} ${client.attributes?.apellido_paterno} ${client.attributes?.apellido_materno}`
            }
          })} />
        {//getFormErrorMessage('city')
        }
        <Card title={titleCardCliente} className='border-round-3xl shadow-none'>
          <Grid templateColumns='repeat(2, 1fr)' gap={8} mb={10}>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>RFC:</span> {client?.attributes.RFC}</div></GridItem>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>Razon Social:</span> {client?.attributes.razon_social}</div></GridItem>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>Domicilio Fiscal:</span> {client?.attributes.codigo_postal}</div></GridItem>
            <GridItem w='100%' h='2' ><div><span style={{ fontWeight: 'bold', opacity: '0.8' }}>Regimen Fiscal:</span>
              <Dropdown value={selectedRegimen} onChange={(e) => setSelectedRegimen(e.value)} options={RegimenesFiscales?.map((regimenFiscal: any) => {
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
                <Dropdown value={selectedUsoCfdi} onChange={(e) => setSelectedUsoCfdi(e.value)} options={USOS_CFDI?.map((regimenFiscal: any) => {
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
                <Dropdown value={selectedFormaPago} onChange={(e) => setSelectedFormaPago(e.value)} options={FORMA_PAGO?.map((regimenFiscal: any) => {
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

        <Card title={titleCardPedido} className='border-round-3xl shadow-none'>
          {needReplace &&
            (
              <>
                <Alert status='warning'>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>¡Espera!</AlertTitle>
                    <AlertDescription> Hay Articulos que no son facturables, sustituye los articulos para facturar.</AlertDescription>
                  </Box>
                </Alert>
              </>
            )
          }
          <DataScroller value={cart} itemTemplate={itemTemplate} rows={5} inline scrollHeight="500px" />
        </Card>

        <Card className='border-round-3xl shadow-none w-5 ml-auto text-right' >
          <Grid templateColumns='repeat(2, 1fr)' gap={2}>
            <GridItem w='100%' h='10' ><span className='font-bold opacity-80'>SUBTOTAL: </span></GridItem>
            <GridItem w='100%' h='10' >{subtotal}</GridItem>
            <GridItem w='100%' h='10' ><span className='font-bold opacity-80'>IMPUESTO: </span></GridItem>
            <GridItem w='100%' h='10' >{importeIVA}</GridItem>
            <GridItem w='100%' h='10'  ><span className='font-bold opacity-80'>TOTAL: </span></GridItem>
            <GridItem w='100%' h='10' >{total}</GridItem>
          </Grid>
        </Card>

        <Box h='40px'>
          <Box display='flex' alignItems='baseline' className='justify-content-end'>
            <Badge borderRadius='full' px='2' colorScheme='teal'>
              <Button label="Confirmar" loading={loading} icon="pi pi-error" className="p-button p-button-success border-round-3xl" style={{ marginLeft: 'auto', display: 'block', background: 'var(--chakra-colors-brand-500)' }} onClick={onSave} />
            </Badge>
            <Box
              color='gray.500'
              fontWeight='semibold'
              letterSpacing='wide'
              fontSize='xs'
              textTransform='uppercase'
              ml='2'
            >

              <Button label="Nota simple" loading={loading} icon="pi pi-book" className="p-button p-button-secondary border-round-3xl" style={{ marginLeft: 'auto', display: 'block' }} onClick={opentSimpleNote} />
            </Box>
          </Box>
        </Box>



        <Dialog
          visible={displaySimpleNote}
          style={{ width: "50vw" }}
          footer={renderFooter("displayBasic")}
          onHide={() => setDisplaySimpleNote(false)}
        // 
        >
          <Box display='flex' justifyContent='center' alignItems='center' height='100vh' ref={boxNote}>
            <NotaPrint client={location.state.cart.cart.client} items={location.state.cart.cart.items} folio={detail?.data?.id} />
          </Box>
          {/* <Nota client={cart.cart.client}  items={cart.cart.cart.items}/> */}
        </Dialog>
      </>

    </Stack>
  );
}

export default ExistingClient
