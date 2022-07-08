import {useState} from 'react';
import { FixedMenuProps, FixedMenu } from "components/FixedMenu";
import { IconAction } from "components/IconAction";
import {FileUpload} from "primereact/fileupload";
import { CatalogueIcon, SaveIcon, ClearIcon, PlusIcon } from "components/icons";
import {
  Stack,
  StackProps,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import NewClient from "pages/payments/invoice/NewClient";

import { newOrder, newItem, uploadFile } from "services/api/orders";
import { Order, Item } from "types/Order";

export interface OrderMenuProps extends FixedMenuProps {
  onOpenCatalogueModal: VoidFunction;
  onOpenConfirmationClear: VoidFunction;
}

export const OrderMenu = (props: OrderMenuProps, cart: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onOpenCatalogueModal, onOpenConfirmationClear } = props;

  const handleNewOrder = () => {
    var date = new Date();
    var order: Order = {
      fecha_pedido: date.toISOString(),
      hora_pedido:
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()),
      estatus: "pendiente",
    };

    /*Crear orden con sus items*/
    var responseNewOrder = newOrder(order);
    responseNewOrder.then((response) => {
      props.cart.items.forEach((item) => {
        var itemNew: Item = {
          cantidad: item.amount,
          pesado: 0,
          cantidad_real: item.amount,
          precio_venta: item.article.attributes.precio_lista,
          pedido: response.data.id,
        };

        console.log(response.data.id);
        newItem(itemNew);
      });
    });

    props.cart.items.forEach((item) => {});
  };
  
  const [selectedFile, setSelectedFile] = useState(null);
  const myUploader = (event) => {
    setSelectedFile(event.files[0]);
}

const handlerUploadFile = () => {
  uploadFile(selectedFile).then((response) => {
    console.log("-----------RESPUESTA----");
    console.log(response);
  });
}

  return (
    <FixedMenu right="3" top="30vh">
      <button onClick={handlerUploadFile}>Send image</button>
      <FileUpload name="demo" url="./upload" onSelect={myUploader} mode="basic" />
      <IconAction
        aria-label="Guardar orden"
        icon={<SaveIcon />}
        onClick={handleNewOrder}
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
        aria-label="Nuevo CLiente"
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
