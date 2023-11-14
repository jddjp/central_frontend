import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  List,
  ListIcon,
  ListItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";
import { Dialog } from "primereact/dialog";
import { RiCheckLine, RiBookmark2Fill } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import {
  getSimpleHistorial,
  postHistorialPayload,
} from "services/api/products";
import { bigTotal } from "helpers/bigTotal";
import { getProductById } from "services/api/products";
import moment from "moment";

interface PropsReceiveOrder {
  headerTitle: String | undefined;
  isVisible: boolean;
  idProduct: number | undefined;
  children?: JSX.Element;
  toogle?: string;
  pedido?: any;
  onHandleHide: () => void;
  onHandleAgree?: () => void;
}

const RecieveOrder = (props: PropsReceiveOrder) => {
  var cantidad = 0
  const [cantidadReceiver, setCantidadReceiver] = React.useState(0);
  const [cantidadDownload, setCantidadDownload] = React.useState(0);
  const [cantidadFaltante, setCantidadFaltante] = React.useState(0);
  const toast = useToast();
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
    unidad_de_medida: 0,
  });
  const [stock, setStock] = useState<any>({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0,
  });

  const [currentStore, setCurrentStore] = useState("");
  const { data: historialApi, refetch } = useQuery(
    ["product", props.idProduct],
    () => getSimpleHistorial(props.idProduct)
  );
  useQuery(
    ["productEdit", props.idProduct],
    () => {
      if (props.idProduct !== undefined) {
        return getProductById(props.idProduct);
      }
    },
    {
      onSuccess(data: any) {
        setProduct({
          ...product,
          nombre: data.articulo ? data.articulo.data.attributes.nombre : "",
          precio_lista: data.articulo
            ? data.articulo.data.attributes.precio_lista
            : 0,
          marca: data.articulo ? data.articulo.data.attributes.marca : "",
          inventario_fiscal: data.articulo
            ? data.articulo.data.attributes.inventario_fiscal
            : 0,
          inventario_fisico: data.articulo
            ? data.articulo.data.attributes.inventario_fisico
            : 0,
          descripcion: data.articulo
            ? data.articulo.data.attributes.descripcion
            : "",
          categoria: data.articulo
            ? data.articulo.data.attributes.categoria
            : "",
          codigo_barras: data.articulo
            ? data.articulo.data.attributes.codigo_barras
            : "",
          codigo_qr: data.articulo
            ? data.articulo.data.attributes.codigo_qr
            : "",
          estado: data.articulo ? data.articulo.data.attributes.estado : "",
          isFiscal: data.articulo
            ? data.articulo.data.attributes.isFiscal
            : false,
          unidad_de_medida: data.articulo
            ? data.articulo.data.attributes.unidad_de_medida
            : "",
        });
        setStock({
          ...stock,
          cantidad: data.cantidad ? data.cantidad : 0,
          unidad_de_medida: data.cantidad ? data.unidad_de_medida.data.id : "",
          sucursal: data.sucursal ? data.sucursal.data.id : "",
        });
      },
    }
  );

  useEffect(() => {
    const storedStore = localStorage.getItem("sucursal");
    if (storedStore !== null) {
      setCurrentStore(storedStore);
    }
  }, []);

  const [historial, setHistorial] = useState("");
  const [weight, setWeight] = useState("");
  const renderBigTotal = bigTotal(historialApi);

  const dispatchPost = useMutation(
    () => postHistorialPayload(historial, weight, props.idProduct),
    {
      onSuccess: () => {
        setHistorial("");
        setWeight("");
      },
    }
  );

  const onHandleItem = (e: number) => {
    if (historial) {
      setHistorial(historial.concat(`, ${e}`));
    } else {
      setHistorial(historial.concat(`${e}`));
    }
  };

  const closeDialog = () => {
    setHistorial("");
    setCantidadDownload(0)
    setCantidadReceiver(0)
    setCantidadFaltante(0)
    props.onHandleHide();
  };

  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHistorial(e.target.value);
  };

  const onHandleChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  };

  const deleteProductDialogFooter = (
    <Box>
      <Box display="flex" justifyContent="center" w="100%" py="4">
        {/*[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number, idx: number) => (
            <Button key={idx} colorScheme='gray' variant='outline' onClick={() => onHandleItem(num)}>{num}</Button>
          ))*/}
      </Box>
      {/*<Button colorScheme='gray' variant='ghost' onClick={() => refetch()}>
        Refrescar
      </Button>*/}
      {props.children}
      <Button
        leftIcon={<RiCheckLine />}
        colorScheme="blue"
        variant="solid"
        onClick={() => ingresarArticle()}
      >
        Ingresar
      </Button>
    </Box>
  );

  var options: any[] = [];
  if (props.pedido != 0) {
    var articulos = props.pedido.attributes.items.data;
    articulos.forEach((articulo: any) => {
      cantidad += articulo.attributes.cantidad;
    });
    var a = props.pedido.attributes.articulos.data;

    a.forEach((articulo: any) => {
      let o = { value: articulo.id, label: articulo.attributes.nombre };
      options.push(o);
    });

    console.log(cantidad)
  }
  useEffect(() => {
    setCantidadReceiver(cantidad)
  }, [])

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      let v = Number(value);
      if (!Number.isNaN(v)) {
        if (selectedArticle.value == "0") {
          toast({
            title: "Selecciona un articulo",
            status: "error",
          });
        } else {
          var c = cantidadReceiver -v
          var descargada = cantidadDownload +v
          if(c < 0){
            c = 0
          }
          setCantidadDownload(descargada)
          setCantidadReceiver(c)
          setValue("");
        }
      } else {
        toast({
          title: "Ingresa un valor valido",
          status: "error",
        });
      }
    }
  };

  const ingresarArticle = ()=>{
    let v = Number(value);
    if (!Number.isNaN(v)) {
      if (selectedArticle.value == "0") {
        toast({
          title: "Selecciona un articulo",
          status: "error",
        });
      } else {
        setValue("");
      }
    } else {
      toast({
        title: "Ingresa un valor valido",
        status: "error",
      });
    }
  }
  const [value, setValue] = React.useState("");
  const handleChange = (event: any) => setValue(event.target.value);
  const [selectedArticle , setSelectedArticle] = useState({value: "0", label: ""});
  return (
    <Dialog
      style={{ width: "600px" }}
      header={`Recibira ${
        props.pedido == 0 ? "azucar" : props.pedido.attributes.comentario
      }`}
      modal
      footer={!props.toogle ? deleteProductDialogFooter : null}
      onHide={closeDialog}
      visible={props.isVisible}
    >
      {!props.toogle && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Input
            //autoFocus
            placeholder="Ingresa una cantidad"
            fontWeight="bold"
            borderRadius="5px"
            onKeyDown={handleKeyDown}
            value={value}
            onChange={handleChange}
            variant="filled"
            width="50%"
          />
          <Select
            placeholder="Selecciona un Articulo"
            options={options}
            value={selectedArticle.value}
            onChange={(e: any) => setSelectedArticle(e.value)}
          />
        </Box>
      )}

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        my="1rem"
      >
        <Text fontSize="13" fontWeight="bold">
          Cantidad a Recibir: <span>{cantidadReceiver}</span>
        </Text>
        <Text fontSize="13" fontWeight="bold">
          Cantidad Descargada: {cantidadDownload}
        </Text>
        <div>
          {stock.cantidad > renderBigTotal.totalBts && (
            <Text fontSize="13" fontWeight="bold">
              Cantidad Faltante: {stock.cantidad - renderBigTotal.totalBts}
            </Text>
          )}
          {stock.cantidad < renderBigTotal.totalBts && (
            <Text fontSize="13" fontWeight="bold">
              Cantidad Sobrante: {cantidadDownload - cantidadReceiver}
            </Text>
          )}
        </div>
      </Box>

      <List
        spacing={3}
        mt="2"
        py="3"
        height={!props.toogle ? "11rem" : "20rem"}
        overflowY="scroll"
      >
        {historialApi?.map((item: any) => (
          <ListItem
            display="flex"
            alignItems="center"
            fontWeight="bold"
            key={item.id}
          >
            <ListIcon as={RiBookmark2Fill} fontSize="25" />
            <Box>
              <Text>{item.attributes.array_numeros}</Text>
              <Text fontSize="13" fontWeight="medium">
                {moment(item.attributes.createdAt).format("L, h:mm:ss a")}
              </Text>
            </Box>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default RecieveOrder;
