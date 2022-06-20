import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react"
import React from "react"

export interface AlertConfirmationProps {
  onClose: VoidFunction,
  isOpen: boolean,
  onConfirm: VoidFunction,
  onReject: VoidFunction,
  message: string,
  title?: string,
}

export const AlertConfirmation = (props: AlertConfirmationProps) => {
  const { title = 'Confirmación', message, onClose, isOpen, onConfirm ,onReject } = props;
  const cancelRef = React.useRef(null)

  return (
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

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
    </AlertDialog>
  );
}