import { useState, useEffect } from 'react';
import { Portal, Stack, useDisclosure, Button, useToast, Checkbox} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { useCart } from './useCart';
import { CatalogueModal } from './CatalogueModal';
import { AddItemModal } from './AddItemModal';
import { AlertConfirmation } from 'components/AlertConfirmation';
import { useAddItemModal } from './useAddItemModal';
import { Formik } from 'formik';
import { CartOrderSummary } from './CartOrderSummary';
import { ArrowRightIcon } from 'components/icons';
import { Cart } from './Cart';
import { PaymentDetails } from './PaymentDetails';
import { OrderMenu } from './OrderMenu';
import { ShoppingCartArticle } from './types';
import { useLocation } from 'react-router-dom';
import { client } from 'services/api/cliente';
import { IOrderAttributes, Item } from 'types/Order';
import ExistingClient from 'pages/payments/invoice/ExistingClient';
import { newItem, newOrder } from 'services/api/orders';
import { sendRandomId, sendRandomIdString } from 'helpers/randomIdUser';
import { getDispatchers, getLibradores } from 'services/api/users';
import { useMutation, useQuery } from 'react-query';
import { newCliente } from '../../../services/api/cliente';
import { AxiosError } from 'axios';

import { SERVER_ERROR_MESSAGE } from 'services/api/errors';
import { extractUnidad } from 'services/api/stocks';
import { useTicketDetail } from '../../../zustand/useTicketDetails';

const initialClient = { name: 'ss' };
const initialPayment = {
  effectiveAmount: 0,
  paycheckAmount: 0,
  creditCardAmount: 0,
  creditAmount: 0,
}; 
export interface LocationOrdenEdit {
  client: client,
  editCart: Boolean,
  cart: IOrderAttributes[]
}

export const CreateOrderPage = () => {

  const [type, setType] = useState(false)
  const { setOrderData } = useTicketDetail()
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [cliente, setCliente] = useState<any>();
  const [paymentsDetails ,setPaymentsDetails] = useState<string>();
  const itemMutation = useMutation(newItem)
  const { data: libradores } = useQuery(["users_librador"], getLibradores, {
    select: (data) => data.map((users: any) => users.id),
  })
  const { data: dispatchers } = useQuery(["users_dispatchers"], getDispatchers, {
    select: (data) => data.map((users: any) => users.id.toString())
  })

  const [distribution, setDistribution] = useState({
    sucursal: 0,
    bodega: 0,
    receptor: 0
  })
  
  const state = location.state as LocationOrdenEdit;
  const redirectTo = (route: string, cart: any, client:any) => () => {

    if(paymentsDetails !== 'finished'){
      toast({
        title: 'Detalle de Pago',
        description: 'Completa las cantidades de pago para proceder con la compra',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

  if(cliente === undefined){
    toast({
      title: 'Indicar cliente',
      description: 'Se requiere el nombre del cliente para poder identificar el pedido',
      status: 'warning',
      duration: 9000,
      isClosable: true,
    });
    return;
  }
  
  if(client.id===undefined){
    
    try {
      //Registrar cliente nuevo con datos dumi sin registro
      client.attributes.RFC="x"
      client.attributes.calle="x"
      client.ciudad="x"
      client.attributes.codigo_postal="1"
      client.attributes.colonia="x"
      client.attributes.correo="example@gmail.com"
      client.attributes.estado="x"
      client.attributes.telefono="1"
      let clientesave  =  newCliente(client.attributes);
      clientesave.then((response) => {
        client.id = response.data.id
        console.log(response.data.id)
        let order: any = {
          id: 0,
          attributes:{
            fecha_pedido: date.toISOString(),
            hora_pedido:
              (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
              ":" +
              (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
              ":" +
              (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()),
            estatus: "pendiente",
            librador: sendRandomId(libradores),
            Despachador: sendRandomIdString(dispatchers),
            cliente:  response.data.id,
            comentario:  cart.items.map((article: any) => {
              return `${article.amount}x ${article.article.attributes.nombre}`
            }).toString(),
            articulos: cart.items.map((article: any) => {
              return article.article.id
            })
          }
        };
        let responseNewOrder = newOrder(order.attributes);
          responseNewOrder.then((response) => {
            setOrderData(response)
            cart.items.forEach((item: any) => {
              extractUnidad(item.article.id)
              .then((extract: number)=> {
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
                    nombre_articulo: item.article.attributes.nombre
                  }
                };

                itemMutation.mutate(itemNew, {
                  onSuccess: () => {
                    navigate(route,{state:{cart,client}});
                  }
                })
                order = response.data;
              })
            });

          });
      });
    } catch (e) {
      const error = e as AxiosError;
      if (error?.response?.status === 400) {
        toast({
          title: 'Error.',
          description: 'No se pudo registrar el cliente.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      } else {
      
        toast({
          title: 'Error.',
          description: SERVER_ERROR_MESSAGE,
          status: 'error',
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
      attributes:{
        fecha_pedido: date.toISOString(),
        hora_pedido:
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":" +
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":" +
          (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()),
        estatus: "pendiente",
        distribution: false,
        librador: sendRandomId(libradores),
        Despachador: sendRandomIdString(dispatchers),
        cliente: cliente.id,
        comentario:  cart.items.map((article: any) => {
          return `${article.amount}x ${article.article.attributes.nombre}`
        }).toString(),
        articulos: cart.items.map((article: any) => {
          return article.article.id
        })
      }
    };
  
    if(client.id!==undefined){
      let responseNewOrder = newOrder(order.attributes);
      responseNewOrder.then((response) => {
        setOrderData(response)
        cart.items.forEach((item: any) => {
          extractUnidad(item.article.id)
          .then((extract: number) => {
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
                nombre_articulo: item.article.attributes.nombre
              }
            };
            itemMutation.mutate(itemNew, {
              onSuccess: () => {
                navigate(route,{state:{cart,client}});
              }
            })
            order = response.data;
          })
        });
      });
    }
  };

  const { total, addItem, clear, removeItem, cart, changeItemAmount , changePriceItem } =
    useCart();
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
  };

  const handleConfirmClearCart = () => {
    clear();
    onCloseConfirmationClear();
  };

  const handleSelectArticle = (article: ShoppingCartArticle | null) => {
    if (article) {
      setArticle(article);
      onOpenAddItemModal();
    } else {
      setArticle(article);
    }
  };  

  useEffect(() => {
    if(state != null){
      setCliente(state.client);
    }
  }, [state]);

  console.log(cart);

  const submitDistribution = () => {
    var date = new Date();
    let orderdistribution: any = {
      id: 0,
      attributes: {
        fecha_pedido: date.toISOString(),
        hora_pedido:
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":" +
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":" +
          (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()),
        estatus: "pendiente",
        receptor: distribution.receptor,
        sucursal: distribution.sucursal,
        bodega: distribution.bodega,
        distribution: true,
        comentario:  cart.items.map((article: any) => {
          return `${article.amount}x ${article.article.attributes.nombre}`
        }).toString(),
        articulos: cart.items.map((article: any) => {
          return article.article.id
        })
      }
    };

    let responseNewOrder = newOrder(orderdistribution.attributes);
      responseNewOrder.then((response) => {
        console.log(response);
        cart.items.forEach((item: any) => {
          extractUnidad(item.article.id)
          .then((extract: number) => {
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
                nombre_articulo: item.article.attributes.nombre
              }
            };
            itemMutation.mutate(itemNew, {
              onSuccess: () => {
                setDistribution({ sucursal: 0, bodega: 0, receptor: 0})
                clear();
                toast({
                  title: 'Enviado para distribucion',
                  description: 'En un momento el receptor lo tendra en su panel',
                  status: 'success',
                  duration: 8000,
                  isClosable: true,
                });
              }
            })
          })
        });
      });
  }

  return (
    <Formik initialValues={{ client: initialClient, payment: initialPayment }} onSubmit={() => {}}>
      <Stack spacing="3" w="80%" mx="auto" my="5">
        <Checkbox colorScheme='red' isChecked={type} onChange={() => {
          setType(!type)
          setCliente('')
          setDistribution({sucursal: 0, bodega: 0, receptor: 0})
        }} fontWeight='bold'>
          { type ? 'Distribucion' : 'Normal' }
        </Checkbox>

        <OrderMenu
          onOpenCatalogueModal={onOpenCatalogueModal}
          onOpenConfirmationClear={onOpenConfirmationClear}
          cart={cart}
          cliente={cliente}/>

        <Header selectedArticle={article} onSelectArticle={handleSelectArticle}/>
        <ExistingClient setCliente={setCliente} type={type} setDistribution={setDistribution} distribution={distribution}/>

        <Cart minH="85vh" maxH="85vh"
          onOpenConfirmationClear={onOpenConfirmationClear}
          onChangeItemAmount={changeItemAmount}
          onChangePriceItem={changePriceItem}
          onRemoveItem={removeItem}
          cart={cart}/>

        {type 
          ? <Button colorScheme="red" size="lg" fontSize="md" rightIcon={<ArrowRightIcon/>} onClick={submitDistribution}>
              Distribuir pedido
            </Button>
          : <>
            <PaymentDetails setPaymentsDetails={setPaymentsDetails} cart={cart} total={total} />
            <CartOrderSummary cart={cart} total={total}>
              <Button colorScheme="red" size="lg" fontSize="md" rightIcon={<ArrowRightIcon/>} disabled={cart.items.length === 0} 
              onClick={redirectTo('/orders/typeNote', cart, cliente)}>
                Pagar
              </Button>
            </CartOrderSummary>
          </>
        }

        <Portal>
          <CatalogueModal isOpen={isOpenCatalogueModal} onClose={onCloseCatalogueModal} onSelectArticle={handleSelectArticleOnCatalogueModal}/>

          <AddItemModal isOpen={isOpenAddItemModal} onClose={onCloseAddItemModal} article={article} onAddItemModal={addItem}/>

          <AlertConfirmation onClose={onCloseConfirmationClear} onConfirm={handleConfirmClearCart} onReject={onCloseConfirmationClear}
            isOpen={isOpenConfirmationClear} title="Confirmación"
            message={
              '¿Desear eliminar todos los elementos de la orden? ' +
              'Una vez realizada está acción no será posible revertirla.'
            }/>
        </Portal>
      </Stack>
    </Formik>
  );
};

export default CreateOrderPage;
