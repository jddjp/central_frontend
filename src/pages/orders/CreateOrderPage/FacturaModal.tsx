import { Button, Heading, Input, Stack,    Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription, Box,
  List,
  ListItem,
  ListIcon,
  Select,
  Flex,
  Spacer } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import React, { useState, useRef, useEffect } from "react";
import { Menu } from "components/Menu";
import { Option } from "components/Option";
import { InputField } from "components/InputField";
import { useReactToPrint } from "react-to-print";
import { Dialog } from "primereact/dialog";
import { useLocation } from 'react-router-dom';
import { MdWarning } from "react-icons/md";
import { getArticulosSustituto_especifico } from "services/api/articles";
import NotaPrint from "./NotaSimple/NotaPrint";
import '../../../global.css'
import { useTicketDetail } from "../../../zustand/useTicketDetails";

export const SearchClientStage = () => {
  return (
    <>
      <Input placeholder="Ingresa nombre de cliente" />
      <Button>Ingresar</Button>
    </>
  );
};

export const RegisterOfElectrictFactura = () => {
  const { isSubmitting } = useFormikContext();
  // Revisar:
  // Ticket (senalar en rojo aquellos productso sin poder facturar)
  // Factura
  // Finalizar
  return (
    <Stack
      w="100%"
      // border='1px' borderColor='gray.200'
    >
      <InputField
        name="RFC"
        placeholder="Ingresa RFC"
        formControlProps={{
          label: "RFC",
          isRequired: true,
        }}
      />
      <InputField
        name="nombre"
        placeholder="Ingresa Nombre"
        formControlProps={{ label: "Nombre", isRequired: true }}
      />
      <InputField
        name="apellido_paterno"
        placeholder="Ingresa Apellido Paterno"
        formControlProps={{ label: "Apellido Paterno", isRequired: true }}
      />
      <InputField
        name="apellido_materno"
        placeholder="Ingresa Apellido Materno"
        formControlProps={{ label: "Apellido Materno", isRequired: true }}
      />
      <InputField
        name="calle"
        placeholder="Ingresa Calle"
        formControlProps={{ label: "Calle", isRequired: true }}
      />
      <InputField
        name="colonia"
        placeholder="Ingresa Colonia"
        formControlProps={{ label: "Colonia", isRequired: true }}
      />
      <InputField
        name="correo"
        placeholder="Ingresa Correo Electrónico"
        formControlProps={{ label: "E-mail", isRequired: true }}
      />
      <InputField
        name="codigo_postal"
        placeholder="Ingresa Código Postal"
        formControlProps={{ label: "Codigo postal", isRequired: true }}
      />
      <InputField
        name="telefono"
        placeholder="Ingresa Teléfono"
        formControlProps={{ label: "Telefono", isRequired: true }}
      />
      <InputField
        name="ciudad"
        placeholder="Ingresa Ciudad"
        formControlProps={{ label: "Ciudad", isRequired: true }}
      />
      <InputField
        name="estado"
        placeholder="Ingresa Estado"
        formControlProps={{ label: "Estado", isRequired: true }}
      />
      <Button type="submit" disabled={isSubmitting}>
        Registrar
      </Button>
    </Stack>
  );
};

export const FacturaModal = (cart:any) => {
  const [cartTemp] = useState(cart);
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route,{ state: { cart: cartTemp.cart }});
  const componentRef = useRef<HTMLDivElement>(null);
  const { detail } = useTicketDetail()
  const [displayBasic, setDisplayBasic] = useState(false);

  const onClick = (name:any) => {
    setDisplayBasic(true);

    /*if (position) {
      setPosition(position);
    }*/
  };
  console.log(detail);
  console.log("FacturaModal:");
  console.log(cart);
  console.log(cart.cart.cart.items);
  console.log(cartTemp.cart.client);
  
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const renderFooter = (name:any) => {
    return (
      <div>
        
        <Button
          onClick={() => setDisplayBasic(false)}
          variant='outline'
        >Cancelar</Button>
        <Button
          onClick={handlePrint}
          variant='outline'
        >Ingresar</Button>
      </div>
    );
  };

  console.log(cart.cart.cart.items);

  return (
    <>
      <Box>
        <Heading fontWeight="bold">Pago realizado con éxito!</Heading>
        <Heading fontWeight="light">Se requiere de:</Heading>

        <Menu w="80%">
          <Option onClick={redirectTo("/orders/typeInvoice")}>Factura</Option>

          <Option onClick={() => onClick("displayBasic")}>Nota simple</Option>
        </Menu>
      </Box>

      <Dialog
        visible={displayBasic}
        style={{ width: "50vw" }}
        footer={renderFooter("displayBasic")}
        onHide={() => setDisplayBasic(false)}
        // 
      >
        <Box display='flex' justifyContent='center' alignItems='center' height='100vh' ref={componentRef}>
          <NotaPrint client={cart.cart.client} items={cart.cart.cart.items} folio={detail.data.id}/>
        </Box>
          {/* <Nota client={cart.cart.client}  items={cart.cart.cart.items}/> */}
      </Dialog>
    </>
  );
};

export const TypeInvoice = () => {

  const location = useLocation();
  const [cartTemp] = useState(location.state?.cart);
  const [flagCheck, setFlagCheck] = useState(false);
  const [flagArticulosSustituir, setFlagArticulosSustituir] = useState(false);
  const [dataToSend, setDataToSend] = useState<{
    articulo_sustituir: string;
    id_articulo_sustituir: any;
    cantidad: any;
    precio_venta: any;
    opciones_sustitutos: any[];
    opcion_selected: any;
  }[]>([]);
  const [executeOnly,setExecuteOnly] = useState(true)

  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route, { state: { cart: cartTemp,  datosFactura : dataToSend}});

  const checkAll = ()=>{
    const filteredData = dataToSend.filter(obj => obj.opcion_selected && obj.opcion_selected.id);
    if (filteredData.length > 0) {
      setFlagCheck(true);
    } else {
      setFlagCheck(false);
    }
  }

  const handleSeleccionar = (index: number, label:any,value: any) => {
    if (!value) {
      dataToSend[index].opcion_selected = {};
      checkAll();
      return;
    }
    dataToSend[index].opcion_selected = {'label':label,'id':value};
    checkAll();
  };  
  
  useEffect(() => {
    const fetchData = () => {
      cartTemp.cart.items.forEach(async (element: any) => {
        const data = await getArticulosSustituto_especifico(element.article.id);
        if (data.data.length > 0) {
          console.log('SI',data.data);
          let options:any = [];
          data.data.forEach((element:any) => {
            options.push  ( {value: element.attributes.articulo_sustituto.data.id, label:element.attributes.articulo_sustituto.data.attributes.nombre})
          });
          const objeto1 = { 
            articulo_sustituir: element.article.attributes.nombre, 
            id_articulo_sustituir: element.article.id,
            cantidad: element.amount,
            precio_venta: element.customPrice ? element.customPrice : element.article.attributes.precio_lista,
            opciones_sustitutos: options,
            opcion_selected:{},
          };
          setDataToSend([...dataToSend,objeto1]);
        }
      });
    };
    fetchData();
  }, []);

  useEffect(()=>{
    if(executeOnly){//verifica si hay articulos no facturables para facturar solo una vez en cuanto se actualiza los datosSend
      if (dataToSend.length > 0) {
        setFlagArticulosSustituir(true)
        setExecuteOnly(false);
      }else{
        setFlagArticulosSustituir(false)
      }
    }
  },[dataToSend]);

  return (
    <>
      {flagArticulosSustituir ? (
      <>
        <Heading fontWeight="bold">Factura</Heading>
        <Stack>
          {flagCheck ? (
              <>
              <Alert status='success'>
                <AlertIcon />
                <Box>
                  <AlertTitle>¡Genial!</AlertTitle>
                  <AlertDescription> No quedan articulos pendientes, selecciona un cliente para progresar.</AlertDescription>
                </Box>
              </Alert>
              </>
            ) : (
              <>
                <Alert status='warning'>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>¡Espera!</AlertTitle>
                    <AlertDescription> Hay Articulos que no son facturables, sustituye los articulos para facturar.</AlertDescription>
                  </Box>
                </Alert>
              </>
            )}

          <Spacer/>
          <Heading as='h4' size='md'>Articulos Pendientes </Heading>
          <List spacing={3}>
            {dataToSend && dataToSend.map((item:any, index:any) => (         
              <ListItem key={index}>
                <Flex minWidth='max-content' alignItems='center' gap='2'>
                  <Box fontSize='lg'>
                    <ListIcon boxSize={6} as={MdWarning} color='yellow.500' />
                    <label>{item.articulo_sustituir}</label>
                  </Box>
                  <Spacer />
                  <Box w='40%'>
                    <Select placeholder='Sleccione articulo'  onChange={(event) => handleSeleccionar(index, event.target.selectedOptions[0].textContent, event.target.value)} size='sm' >
                      {item.opciones_sustitutos.map((opcion: any, index: any) => (
                        <option key={index} value={opcion.value}>{opcion.label}</option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Spacer/>
        <Menu w="80%">
          {flagCheck ? (
            <>
              <Option onClick={redirectTo("/orders/typeInvoice/FacturaElectronica")}>
                Cliente existente
              </Option>
              <Option onClick={redirectTo("/orders/typeInvoice/newCliente")}>
                Registrar Nuevo Cliente
              </Option>
            </>
          ) : null}
        </Menu>
      </>):(
      <>
        <Menu w="80%">
          <Option onClick={redirectTo("/orders/typeInvoice/FacturaElectronica")}>
            Cliente existente
          </Option>
          <Option onClick={redirectTo("/orders/typeInvoice/newCliente")}>
            Registrar Nuevo Cliente
          </Option>
        </Menu>
      </>)}

    </>
  );
};
