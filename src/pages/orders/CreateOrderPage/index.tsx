import { useState, useEffect } from "react";
import {
  Portal,
  Stack,
  useDisclosure,
  Button,
  useToast,
  Checkbox,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { useCart } from "./useCart";
import { CatalogueModal } from "./CatalogueModal";
import { AddItemModal } from "./AddItemModal";
import { AlertConfirmation } from "components/AlertConfirmation";
import { useAddItemModal } from "./useAddItemModal";
import { Formik } from "formik";
import { CartOrderSummary } from "./CartOrderSummary";
import { ArrowRightIcon } from "components/icons";
import { Cart } from "./Cart";
import { PaymentDetails } from "./PaymentDetails";
import { OrderMenu } from "./OrderMenu";
import { ShoppingCartArticle } from "./types";
import { useLocation } from "react-router-dom";
import { client, createCliente, getClienteGeneral, getClientsByName } from "services/api/cliente";
import { IOrderAttributes, Item } from "types/Order";
import ExistingClient from "pages/payments/invoice/ExistingClient";
import { newItem, newOrder } from "services/api/orders";
import { sendRandomId, sendRandomIdString } from "helpers/randomIdUser";
import { getDispatchers, getLibradores } from "services/api/users";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { newCliente } from "../../../services/api/cliente";
import { AxiosError } from "axios";

import { SERVER_ERROR_MESSAGE } from "services/api/errors";
import { extractUnidad } from "services/api/stocks";
import { useTicketDetail } from "../../../zustand/useTicketDetails";
import { useAuth } from "hooks/useAuth";
import {
  getStockByArticleAndSucursal,
  getSucursal,
  listArticlesBySucursal,
  updateStockSucursal,
} from "services/api/articles";
import async from "react-select/dist/declarations/src/async/index";
import { columns } from '../ListExistedOrdersPage/config';
import { Sucursal } from "types/Sucursal";
import { clienteModel } from "models/cliente";

const initialClient = { name: "ss" };
const initialPayment = {
  effectiveAmount: 0,
  paycheckAmount: 0,
  creditCardAmount: 0,
  creditAmount: 0,
};
export interface LocationOrdenEdit {
  client: client;
  editCart: Boolean;
  cart: IOrderAttributes[];
}

export const CreateOrderPage = () => {
  const [type, setType] = useState(false);
  const auth = useAuth();
  const { setOrderData } = useTicketDetail();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [cliente, setCliente] = useState<any>();
  const [sucursal, setSucursal] = useState<any>();
  const [paymentsDetails, setPaymentsDetails] = useState<string>();
  const itemMutation = useMutation(newItem);
  const cCliente = useMutation(createCliente);
  const { data: libradores } = useQuery(["users_librador"], getLibradores, {
    select: (data) => data.map((users: any) => users.id),
  });
  const { data: dispatchers } = useQuery(
    ["users_dispatchers"],
    getDispatchers,
    {
      select: (data) => data.map((users: any) => users.id.toString()),
    }
  );
  const [articles, setArticles] = useState([{ descripcion: "dsadsadasdas" }]);
  const [distribution, setDistribution] = useState({
    sucursal: 0,
    bodega: 0,
    receptor: 0,
  });

  const [origen, setOrigen] = useState({
    sucursal: 0,
    bodega: 0,
    receptor: 0,
    desc: "",
  });

  const [stockId, setstockId] = useState(0);
  const state = location.state as LocationOrdenEdit;
  const redirectTo = (route: string, cart: any, client: any, sucursal: any) => async () => {
    if (paymentsDetails !== "finished") {
      toast({
        title: "Detalle de Pago",
        description:
          "Completa las cantidades de pago para proceder con la compra",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (cliente === undefined || cliente == null) {
      const clienteGeneral = await getClienteGeneral();
      
      setCliente(clienteGeneral);
      setCliente((prevValor: any) => {
        console.log('Valor actualizado inmediatamente:', prevValor);
  
        // Puedes realizar otras operaciones con el valor actualizado aquí
        // ...
  
        // Devuelve el nuevo valor que deseas asignar
        return clienteGeneral;
      });

    }

    
    if (client.id === undefined) {
      try {
        //Registrar cliente nuevo con datos dumi sin registro
        client.attributes.RFC = "x";
        client.attributes.calle = "x";
        client.ciudad = "x";
        client.attributes.codigo_postal = "1";
        client.attributes.colonia = "x";
        client.attributes.correo = "example@gmail.com";
        client.attributes.estado = "x";
        client.attributes.telefono = "1";
        let clientesave = newCliente(client.attributes);
        clientesave.then((response) => {
          client.id = response.data.id;
          let order: any = {
            id: 0,
            attributes: {
              fecha_pedido: date.toISOString(),
              hora_pedido:
                (date.getHours() < 10
                  ? "0" + date.getHours()
                  : date.getHours()) +
                ":" +
                (date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes()) +
                ":" +
                (date.getSeconds() < 10
                  ? "0" + date.getSeconds()
                  : date.getSeconds()),
              estatus: "pendiente",
              librador: sendRandomId(libradores),
              Despachador: sendRandomIdString(dispatchers),
              cliente: response.data.id,
              comentario: cart.items
                .map((article: any) => {
                  return `${article.amount}x ${article.article.attributes.nombre}`;
                })
                .toString(),
              articulos: cart.items.map((article: any) => {
                return article.article.id;
              }),
            },
          };
          let responseNewOrder = newOrder(order.attributes);
          responseNewOrder.then((response) => {
            setOrderData(response);
            cart.id_pedido = response.data.id;
            cart.items.forEach((item: any) => {
              extractUnidad(item.article.id).then((extract: number) => {
                let itemNew: Item = {
                  id: 0,
                  attributes: {
                    cantidad: item.amount,
                    pesado: false,
                    cantidad_real: item.amount,
                    precio_venta: item.article.attributes.precio_lista,
                    pedido: response.data.id,
                    articulos: item.article.id,
                    unidad_de_medida: extract,
                    nombre_articulo: item.article.attributes.nombre,
                  },
                }; 
                ////.......................
                itemMutation.mutate(itemNew, {
                  onSuccess: () => {
                    navigate(route, { state: { cart, client, sucursal } });
                  },
                });
                order = response.data;
              });
            });
          });
        });
      } catch (e) {
        const error = e as AxiosError;
        if (error?.response?.status === 400) {
          toast({
            title: "Error.",
            description: "No se pudo registrar el cliente.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        } else {
          toast({
            title: "Error.",
            description: SERVER_ERROR_MESSAGE,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        }
      }
    }

    let date = new Date();
    let order: any = {
      id: 0,
      attributes: {
        fecha_pedido: date.toISOString(),
        hora_pedido:
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":" +
          (date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes()) +
          ":" +
          (date.getSeconds() < 10
            ? "0" + date.getSeconds()
            : date.getSeconds()),
        sucursal: Number(localStorage.getItem("sucursal")),
        estatus: "pendiente",
        distribution: false,
        librador: sendRandomId(libradores),
        Despachador: sendRandomIdString(dispatchers),
        cliente: cliente.id,
        comentario: cart.items
          .map((article: any) => {
            return `${article.amount}x ${article.article.attributes.nombre}`;
          })
          .toString(),
        articulos: cart.items.map((article: any) => {
          return article.article.id;
        }),
      },
    };

    if (client.id !== undefined) {
      let responseNewOrder = newOrder(order.attributes);
      responseNewOrder.then((response) => {
        setOrderData(response);

        cart.id_pedido = response.data.id;
        cart.items.forEach((item: any) => {
          extractUnidad(item.article.id).then((extract: number) => {
            var itemNew: Item = {
              id: 0,
              attributes: {
                cantidad: item.amount,
                pesado: false,
                cantidad_real: item.amount,
                precio_venta: item.article.attributes.precio_lista,
                pedido: response.data.id,
                articulos: item.article.id,
                unidad_de_medida: extract,
                nombre_articulo: item.article.attributes.nombre,
              },
            };
            itemMutation.mutate(itemNew, {
              onSuccess: () => {
                navigate(route, { state: { cart, client, sucursal } });
              },
            });
            order = response.data;
          });
        });
      });
    }
  };

  const {
    total,
    addItem,
    clear,
    removeItem,
    cart,
    changeItemAmount,
    changePriceItem,
  } = useCart();
  const {
    isOpenAddItemModal,
    onCloseAddItemModal,
    onOpenAddItemModal,
    article,
    setArticle,
  } = useAddItemModal();
  const {
    isOpen: isOpenCatalogueModal,
    onClose: onCloseCatalogueModal,
    onOpen: onOpenCatalogueModal,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmationClear,
    onClose: onCloseConfirmationClear,
    onOpen: onOpenConfirmationClear,
  } = useDisclosure();

  const handleSelectArticleOnCatalogueModal = (
    article: ShoppingCartArticle
  ) => {
    setArticle(article);
    onCloseCatalogueModal();
    onOpenAddItemModal();
    //console.log("algo")
  };

  const handleConfirmClearCart = () => {
    clear();
    onCloseConfirmationClear();
  };

  const handleSelectArticle = async (article: ShoppingCartArticle | null) => {
    if (article) {
      setArticle(article);
      //if (!type) {
      onOpenAddItemModal();
      //}
      /* else {
        const result = await getStockByArticleAndSucursal(
          origen.sucursal,
          article.id
        );
        article.attributes.cantidad_stock = result[0].attributes.cantidad;
        setstockId(result[0].id);
        setArticle(article);
        onOpenAddItemModal();
      }*/
    } else {
      setArticle(article);
    }
  };

  const handleSelectSucursal = async (sucursal: Sucursal | null) => {
    setSucursal(sucursal);
  }

  useEffect(() => {
    if (state != null) {
      setCliente(state.client);
    }
  }, [state]);
  const submitDistribution = async () => {

    const storedStore = localStorage.getItem("sucursal");

    if (storedStore == "0") {
      toast({
        title: "Datos incompletos",
        description: "Selecciona un origen para continuar",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    distribution.sucursal = Number(storedStore)
    if (cart.items.length == 0) {
      toast({
        title: "Lista Vacia",
        description: "Selecciona al menos un articulo",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (distribution.receptor == 0) {
      toast({
        title: "Datos incompletos",
        description: "Seleccionar un receptor para continuar",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (distribution.sucursal == 0) {
      toast({
        title: "Datos incompletos",
        description: "Seleccionar una sucursula para continuar",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    /*if (origen.sucursal == 0) {
      toast({
        title: "Datos incompletos",
        description: "Selecciona un origen para continuar",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }*/
    var date = new Date();
    let orderdistribution: any = {
      id: 0,
      attributes: {
        fecha_pedido: date.toISOString(),
        hora_pedido:
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":" +
          (date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes()) +
          ":" +
          (date.getSeconds() < 10
            ? "0" + date.getSeconds()
            : date.getSeconds()),
        estatus: "pendiente",
        receptor: distribution.receptor,
        sucursal: distribution.sucursal,
        origen: origen.sucursal,
        distribution: true,
        comentario: cart.items
          .map((article: any) => {
            return `${article.amount}x ${article.article.attributes.nombre}`;
          })
          .toString(),
        articulos: cart.items.map((article: any) => {
          return article.article.id;
        }),
      },
    };
    let responseNewOrder = newOrder(orderdistribution.attributes);
    responseNewOrder.then((response) => {
      clear();
      cart.id_pedido = response.data.id;
      cart.items.forEach(async (item: any) => {
        const resultStock = getStockByArticleAndSucursal(
          origen.sucursal,
          item.article.id
        );
        resultStock.then((response) => {
          const update = updateStockSucursal(
            response[0].attributes.cantidad - item.amount,
            response[0].id
          );
        });
        extractUnidad(item.article.id).then((extract: number) => {
          var itemNew: Item = {
            id: 0,
            attributes: {
              cantidad: item.amount,
              pesado: false,
              cantidad_real: item.amount,
              precio_venta: item.article.attributes.precio_lista,
              pedido: response.data.id,
              articulos: item.article.id,
              unidad_de_medida: extract,
              nombre_articulo: item.article.attributes.nombre,
            },
          };
          itemMutation.mutate(itemNew, {
            onSuccess: () => {
              setDistribution({ sucursal: 0, bodega: 0, receptor: 0 });
            },
          });
        });
      });
      toast({
        title: "Enviado para distribucion",
        description: "En un momento el receptor lo tendra en su panel",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    });
  };
  const [nameSuc, setNameSuc] = useState("");

  var suc: Number = Number(localStorage.getItem("sucursal"));
  const GetSucursalName = () => {
    var s = getSucursal(suc);
    s.then((response) => {
      setNameSuc(response.attributes.nombre);
    });

    //
    return nameSuc;
  };
  var { data: value, refetch } = useQuery(["listaProductos"], () => {
    if (auth.user?.roleCons != "Supervisor") {
      let sucusarSelec = Number(localStorage.getItem('sucursal'))
      return listArticlesBySucursal(sucusarSelec)
    }
    else {
      let sucusarSelec = Number(localStorage.getItem('sucursal'))
      return listArticlesBySucursal(sucusarSelec)
    }
  }
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Formik
      initialValues={{ client: initialClient, payment: initialPayment }}
      onSubmit={() => { }}
    >
      <Stack spacing="3" w="80%" mx="auto" my="5">
        <Text fontWeight="bold" textAlign="center" fontSize="1.2em">
          Nueva Orden
        </Text>
        {auth.user?.roleCons != "Supervisor" && <Text fontWeight="bold" textAlign="end">
          {" "}
          SUCURSAL:{" "}
          <Badge ml="1" fontSize="1.2em" colorScheme="red">
            {GetSucursalName()}
          </Badge>
        </Text>}
        <Stack direction="row" textAlign="end"></Stack>

        {auth.user?.roleCons === "Supervisor" && (
          <Checkbox
            colorScheme="red"
            isChecked={type}
            onChange={() => {
              setType(!type);
              setCliente("");
              setDistribution({ sucursal: 0, bodega: 0, receptor: 0 });
            }}
            fontWeight="bold"
          >
            {type ? "Distribucion" : "Normal"}
          </Checkbox>
        )}
        {
          type && <Text fontWeight="bold" fontSize={18}>
            Origen
          </Text>
        }
        {(
          <Header
            selectedArticle={article}
            onSelectSucursal={handleSelectSucursal}
            onSelectArticle={handleSelectArticle}
          />
        )}
        <OrderMenu
          onOpenCatalogueModal={onOpenCatalogueModal}
          onOpenConfirmationClear={onOpenConfirmationClear}
          cart={cart}
          cliente={cliente}
        />
        <ExistingClient
          setCliente={setCliente}
          type={type}
          setDistribution={setDistribution}
          distribution={distribution}
          setOrigen={setOrigen}
          origen={origen}
          articles={articles}
          setArticles={setArticles}
        />
        {/*type && (
          <Header
            selectedArticle={article}
            onSelectSucursal={handleSelectSucursal}
            onSelectArticle={handleSelectArticle}
            type={type}
            origen={origen}
          />
        )*/}

        <Cart
          minH="85vh"
          maxH="85vh"
          onOpenConfirmationClear={onOpenConfirmationClear}
          onChangeItemAmount={changeItemAmount}
          onChangePriceItem={changePriceItem}
          onRemoveItem={removeItem}
          cart={cart}
        />

        {type ? (
          <Button
            colorScheme="red"
            size="lg"
            fontSize="md"
            rightIcon={<ArrowRightIcon />}
            onClick={submitDistribution}
          >
            Distribuir pedido
          </Button>
        ) : (
          <>
            <PaymentDetails
              setPaymentsDetails={setPaymentsDetails}
              cart={cart}
              total={total}
            />
            <CartOrderSummary cart={cart} total={total}>
              <Button
                colorScheme="red"
                size="lg"
                fontSize="md"
                rightIcon={<ArrowRightIcon />}
                disabled={cart.items.length === 0}
                onClick={redirectTo("/orders/typeNote", cart, cliente, sucursal)}
              >
                Pagar
              </Button>
            </CartOrderSummary>
          </>
        )}

        <Portal>
          <CatalogueModal
            valores={value}
            isOpen={isOpenCatalogueModal}
            onClose={onCloseCatalogueModal}
            onSelectArticle={handleSelectArticleOnCatalogueModal}
          />

          <AddItemModal
            isOpen={isOpenAddItemModal}
            onClose={onCloseAddItemModal}
            article={article}
            onAddItemModal={addItem}
            type={type}
            origen={origen}
          />

          <AlertConfirmation
            onClose={onCloseConfirmationClear}
            onConfirm={handleConfirmClearCart}
            onReject={onCloseConfirmationClear}
            isOpen={isOpenConfirmationClear}
            title="Confirmación"
            message={
              "¿Desear eliminar todos los elementos de la orden? " +
              "Una vez realizada está acción no será posible revertirla."
            }
          />
        </Portal>
      </Stack>
    </Formik>
  );
};

export default CreateOrderPage;
