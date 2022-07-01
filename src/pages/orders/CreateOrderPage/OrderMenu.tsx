import { FixedMenuProps, FixedMenu } from "components/FixedMenu";
import { IconAction } from "components/IconAction";
import { CatalogueIcon, SaveIcon, ClearIcon, PlusIcon } from "components/icons";
import { Stack, StackProps, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from "@chakra-ui/react"
import NewClient from "pages/payments/invoice/NewClient";

export interface OrderMenuProps extends FixedMenuProps {
  onOpenCatalogueModal: VoidFunction,
  onOpenConfirmationClear: VoidFunction,
}

export const OrderMenu = (props: OrderMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    onOpenCatalogueModal,
    onOpenConfirmationClear,
  } = props;
  
  return (
    <FixedMenu right='3' top='30vh'  >
      <IconAction aria-label='Guardar orden' icon={<SaveIcon />}/>
      <IconAction
        variant='outline'
        aria-label='Catálogo'
        fontSize='20px'
        onClick={onOpenCatalogueModal}
        icon={<CatalogueIcon />}
      />
      <IconAction
        variant='outline'
        aria-label='Limpiar orden'
        fontSize='20px'
        icon={<ClearIcon />}
        onClick={onOpenConfirmationClear}
      />
      <IconAction
        variant='outline'
        aria-label='Nuevo CLiente'
        fontSize='20px'
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
          <NewClient/>
        </ModalBody>
    
        
      </ModalContent>
    </Modal> 
    </FixedMenu>
    
    
  )
}