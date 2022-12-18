import { useState } from 'react';
import { FixedMenuProps, FixedMenu } from "components/FixedMenu";
import { IconAction } from "components/IconAction";
import { CatalogueIcon, SaveIcon, ClearIcon, PlusIcon } from "components/icons";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import NewClient from "pages/payments/invoice/NewClient";
import { Item } from "types/Order";
import { ShoppingCart } from './types';
import { newItem, newOrder } from 'services/api/orders';
import { extractFlagOrders } from "services/api/orders";
import { sendRandomId } from 'helpers/randomIdUser';
import { useQuery } from 'react-query';
import { getDispatchers, getLibradores } from 'services/api/users';

export interface OrderMenuProps extends FixedMenuProps {
  onOpenCatalogueModal: VoidFunction;
  onOpenConfirmationClear: VoidFunction;
  cart: ShoppingCart
  cliente: any
}

export const OrderMenu = (props: OrderMenuProps) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [disponibleUsers, setDisponibleUsers] = useState<number[]>([])
  const [dispatchers, setDispatchers] = useState<number[]>([])
  const [libradores, setLibradores] = useState<number[]>([])
  const { onOpenCatalogueModal, onOpenConfirmationClear } = props;

  useQuery(["users_librador"], getLibradores, {
    onSuccess: (libradores) => {
      setLibradores(libradores.map((users: any) => users.id))
    }
  })
  useQuery(["users_dispatchers"], getDispatchers, {
    onSuccess: (dispatchers) => {
      setDispatchers(dispatchers.map((users: any) => users.id))
    }
  })
  // useQuery(["flagOrders"], extractFlagOrders, {
  //   onSuccess: (orders) => {
  //     setDisponibleUsers([...disponibleUsers, orders.filter((order: any) => order?.attributes?.cliente?.data?.id)
  //     .map((order:any) =>order?.attributes?.cliente?.data?.id)])
  //   }
  // })

  const toast = useToast();
  const handleNewOrder = () => {

    if(props.cart.items.length === 0) {
      toast({
        title: 'Agregar productos',
        description: 'Se requiere al menos un producto para poder guardar la orden',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if(props.cliente == null){
      toast({
        title: 'Indicar cliente',
        description: 'Se requiere indicar el cliente para poder indentificar el pedido',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    var date = new Date();
    var order: any = {
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
        repartidor: sendRandomId(dispatchers),
        cliente: props.cliente.id,
        articulos: []
      }
    };
   props.cart.items.forEach(
       elements => order.attributes.articulos.push(elements.article.id)
    );
    /*-Crear orden con sus items*/
    var responseNewOrder = newOrder(order.attributes);
    responseNewOrder.then((response) => {
      props.cart.items.forEach((item) => {
        var itemNew: Item = {
          id: 0,
          attributes: {
          cantidad: item.amount,
          pesado: 0,
          cantidad_real: item.amount,
          precio_venta: item.article.attributes.precio_lista,
          pedido: response.data.id,
          articulos: item.article.id
          }
        };

        // console.log("----------");
        // console.log(response.data.id);
        // console.log(item.article.id);
        
        newItem(itemNew);
        order = response.data;
        
      });
    });

  };
  
  // const [selectedFile, setSelectedFile] = useState(null);
  /*const myUploader = (event) => {
    setSelectedFile(event.files[0]);
}*/

  return (
    <FixedMenu right="3" top="30vh">
      
      <IconAction
        aria-label="Guardar orden"
        onClick={handleNewOrder}
        icon={<SaveIcon />}
      />
      <IconAction
        variant="outline"
        aria-label="Catálogo"
        fontSize="20px"
        onClick={onOpenCatalogueModal}
        icon={<CatalogueIcon />}
      />
      <IconAction
        variant="outline"
        aria-label="Limpiar orden"
        fontSize="20px"
        icon={<ClearIcon />}
        onClick={onOpenConfirmationClear}
      />
      <IconAction
        variant="outline"
        aria-label="Nuevo Cliente"
        fontSize="20px"
        icon={<PlusIcon />}
        onClick={onOpen}
      />
      {/* <Button onClick={onOpen} style={{width: "40%"}}></Button> */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registro de facturación electrónico</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NewClient />
          </ModalBody>
        </ModalContent>
      </Modal>
    </FixedMenu>
  );
};
