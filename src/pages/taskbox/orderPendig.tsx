import { useState, ChangeEvent, useEffect } from 'react'
import { Box, Button, IconButton, Input, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { Dialog } from "primereact/dialog";
import { RiCheckLine, RiBookmark2Fill, RiTruckFill } from 'react-icons/ri'
import { useMutation, useQuery } from 'react-query';
import { getSimpleHistorial, postHistorialPayload } from 'services/api/products';
import { bigTotal } from 'helpers/bigTotal';
import { getProductById } from "services/api/products";

import moment from 'moment';
import { getOrderPendiente } from 'services/api/orders';
import { MdArrowCircleDown, MdEdit } from 'react-icons/md';

interface OrderPending {
  headerTitle: String | undefined,
  isVisible: boolean,
  idProduct: number | undefined,
  children?: JSX.Element,
  toogle?: string

  onHandleHide: () => void,
  onHandleAgree?: () => void
}

const OrderPending = (props: OrderPending) => {
  const [product, setProduct] = useState<any>({
    nombre: "",
    precio_lista: 0,
    marca: "",
    inventario_fiscal: 0,
    inventario_fisico: 0,
    descripcion: "",
    categoria: "",
    codigo_barras: "",
    codigo_qr: "",
    estado: "",
    foto: "",
    isFiscal: false,
    unidad_de_medida: 0
  })
  const [stock, setStock] = useState<any>({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0
  })

  
  const [currentStore, setCurrentStore] = useState('');
  const { data: ordenes } = useQuery(["orders"], getOrderPendiente);

  var orders :any [] = []
  useQuery(["productEdit", props.idProduct], () => {
    if (props.idProduct !== undefined) {
      return getProductById(props.idProduct);
    }
  }, {
    onSuccess(data: any) {
      setProduct({
        ...product,
        nombre: data.articulo ? data.articulo.data.attributes.nombre : '',
        precio_lista: data.articulo ? data.articulo.data.attributes.precio_lista : 0,
        marca: data.articulo ? data.articulo.data.attributes.marca : '',
        inventario_fiscal: data.articulo ? data.articulo.data.attributes.inventario_fiscal : 0,
        inventario_fisico: data.articulo ? data.articulo.data.attributes.inventario_fisico : 0,
        descripcion: data.articulo ? data.articulo.data.attributes.descripcion : '',
        categoria: data.articulo ? data.articulo.data.attributes.categoria : '',
        codigo_barras: data.articulo ? data.articulo.data.attributes.codigo_barras : '',
        codigo_qr: data.articulo ? data.articulo.data.attributes.codigo_qr : '',
        estado: data.articulo ? data.articulo.data.attributes.estado : '',
        isFiscal: data.articulo ? data.articulo.data.attributes.isFiscal : false,
        unidad_de_medida: data.articulo ? data.articulo.data.attributes.unidad_de_medida : '',
      })
      setStock({
        ...stock,
        cantidad: data.cantidad ? data.cantidad : 0,
        unidad_de_medida: data.cantidad ? data.unidad_de_medida.data.id : '',
        sucursal: data.sucursal ? data.sucursal.data.id : '',
      })
    },
  })

  useEffect(()=>{
    const storedStore = localStorage.getItem("sucursal");
    if(storedStore !== null){
      setCurrentStore(storedStore)
    }
  },[]);

  const [historial, setHistorial] = useState('')
  const [weight, setWeight] = useState('')
  //const renderBigTotal = bigTotal(historialApi)

  const dispatchPost = useMutation(() => postHistorialPayload(historial, weight, props.idProduct), {
    onSuccess: () => {
      setHistorial('')
      setWeight('')
    }
  })

  const onHandleItem = (e: number) => {
    if (historial) {
      setHistorial(historial.concat(`, ${e}`))
    } else {
      setHistorial(historial.concat(`${e}`))
    }
  }

  const closeDialog = () => {
    setHistorial('')
    props.onHandleHide()
  }

  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHistorial(e.target.value)
  }

  const onHandleChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)
  }

  ordenes.forEach((orden:any) => {
    
    
    var articulos : any [] = orden.attributes.articulos.data
    console.log(articulos)
    articulos.forEach((articulo : any) => {
      if(articulo.id == props.idProduct){
        orders.push(orden);
      }
    });
    
  });
  return (
    <Dialog style={{ width: '600px' }} header={`${props.headerTitle} `} modal
      onHide={closeDialog}
      visible={props.isVisible}>
      { orders.length != 0 && <List spacing={3} mt='2' py='3' height={!props.toogle ? '11rem' : '20rem'} overflowY='scroll'>
        {orders?.map((item: any) => (
          <ListItem display='flex' alignItems='center' fontWeight='bold' key={item.id}>
            <ListIcon as={RiTruckFill} fontSize='40' color='#e1d004' />
            <Box display='flex' justifyContent='space-between' w='100%'>
              <Box>
              <Text>{item.attributes.comentario}</Text>
              <Text>{item.attributes.estatus}</Text>
              <Text fontSize='13' fontWeight='medium'>{moment(item.attributes.createdAt).format('L, h:mm:ss a')}</Text>
              </Box>
              <Box display='flex' alignItems='center' marginRight='5'>
                <IconButton aria-label='show dialog' icon={<MdArrowCircleDown/>} borderRadius='full' colorScheme='green' 
                onClick={() => closeDialog} fontSize='20px' size='lg'/>
              </Box>
              </Box>
          </ListItem>
        ))}
      </List>}
      { orders.length == 0 &&<Text>NO HAY ORDENES CON ESTE ARICULO , PENDIENTE DE RECIBIR</Text>}
    </Dialog>
  );
}

export default OrderPending;