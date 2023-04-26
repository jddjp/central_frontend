import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogOverlay, Button } from "@chakra-ui/react"
import { useRef } from "react";

export interface AlertConfirmationProps {
  isOpen: boolean,
  title?: string,
  message: string,
  onClose: VoidFunction,
  onConfirm: VoidFunction,
  onReject: VoidFunction,
}

export const AlertConfirmation = (props: AlertConfirmationProps) => {
  const { title = 'Confirmación', message, onClose, isOpen, onConfirm ,onReject } = props;
  const cancelRef = useRef(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {message}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant='solid' colorScheme='brand' onClick={onConfirm}>
              Confirmar
            </Button>
            <Button variant='outline' colorScheme='brand' onClick={onReject} ml={3}>
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>

    </AlertDialog>
  );
}