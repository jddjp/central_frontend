import { Button, Heading, Input, Stack, Select, useToast } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import React, { useState, useRef, useEffect } from "react";

import { Menu } from "components/Menu";
import { Option } from "components/Option";
import { InputField } from "components/InputField";
import ReactToPrint from "react-to-print";
import { Nota } from "./NotaSimple/Nota";
import { Dialog } from "primereact/dialog";
import { Button as ButtonPrime } from "primereact/button";
import { client } from 'services/api/cliente';
import {TiPrinter } from 'react-icons/ti';
import ConectorPluginV3 from "./ConectorPluginV3";

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

  const [cartTemp, setCart] = useState(cart);
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route);
  const [millisegundos, setMillisegundos] = useState("1000");
  const componentRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState("center");
  const [displayBasic, setDisplayBasic] = useState(false);

  const [impresoraSeleccionada,setImpresoraSeleccionada] = useState("");
  const [impresoras, setImpresoras] = useState([]);
  const toast = useToast()
  const onClick = (name:any) => {
    setDisplayBasic(true);

    /*if (position) {
      setPosition(position);
    }*/
  };

  useEffect(()=>{
    const fetchData = async () => {
      const res = await ConectorPluginV3.obtenerImpresoras();
      setImpresoras(res);
      console.log("res",res);
    }
    fetchData();
  },[]);

  const handlePrint = async () =>{
    if (!impresoraSeleccionada) {
      return  toast({
        title: 'Seleccione una impresora',
        status: 'error',
        isClosable: true,
        duration: 2000,
      })
    }
    
    setDisplayBasic(false);

    const conector = new ConectorPluginV3();
    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto("Hola REACT datos datos")
      .Feed(1)
      .EscribirTexto("MENSAJE")
      .Feed(1)
      .DescargarImagenDeInternetEImprimir("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png", ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL, 400)
      .Iniciar()
      .Feed(1);
    const respuesta = await conector.imprimirEn(impresoraSeleccionada);
    if (respuesta == true) {
      console.log("Impresión correcta");
    } else {
      console.log("Error: " + respuesta);
    }
  }

  //console.log("FacturaModal:");
  //console.log(cart.cart.cart.items);
  //console.log(cartTemp.cart.client);
  
  
  

  const renderFooter = (name:any) => {
    return (
      <div>
        
        <Button
          onClick={() => setDisplayBasic(false)}
          variant='outline'
        >Cancelar</Button>
        <Button
        leftIcon={<TiPrinter  />}
        onClick={handlePrint}>
            Imprimir
        </Button>
        {/* <ReactToPrint
          trigger={() => (
            <Button leftIcon={<TiPrinter  />} onClick={() => setDisplayBasic(false)}>Ingresar</Button>
          )}
          content={() => componentRef.current}
        /> */}
      </div>
    );
  };

  return (
    <>
      <Heading fontWeight="bold">Pago realizado con éxito!</Heading>
      <Heading fontWeight="light">Se requiere de:</Heading>

      <Menu w="80%">
        <Option onClick={redirectTo("/orders/typeInvoice")}>Factura</Option>

        <Option onClick={() => onClick("displayBasic")}>Nota simple</Option>
      </Menu>

      <Dialog
        visible={displayBasic}
        style={{ width: "50vw" }}
        footer={renderFooter("displayBasic")}
        onHide={() => setDisplayBasic(false)}
      >
        <div ref={componentRef}>
          <Nota client={cart.cart.client}  items={cart.cart.cart.items}/>
        </div>
        <Select bg='#E2E8F0' value={impresoraSeleccionada} onChange={(event)=>{setImpresoraSeleccionada(event.target.value)}}>
          <option value="" disabled>Seleccione una impresora</option>
          {impresoras.map((impresora) => (
            <option key={impresora} value={impresora}>
              {impresora}
            </option>
          ))}
        </Select>
      </Dialog>
    </>
  );
};

export const TypeInvoice = () => {
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route);
  return (
    <>
      <Heading fontWeight="bold">Factura</Heading>

      <Menu w="80%">
        <Option onClick={redirectTo("/orders/typeInvoice/ExistingClient")}>
          Cliente existente
        </Option>
        <Option onClick={redirectTo("/orders/typeInvoice/newCliente")}>
          Registrar Nuevo Cliente
        </Option>
      </Menu>
    </>
  );
};
