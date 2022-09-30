import { Stack, StackProps, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from "@chakra-ui/react"
  import { useState, Dispatch, SetStateAction, useRef,useEffect } from 'react';
import { InputField } from "components/InputField"
import { useFormikContext } from "formik"
import NewClient from "pages/payments/invoice/NewClient"
import { ShoppingCart } from "../types"
import { client } from '../../../../services/api/cliente';
import { InformationArea, InformationAreaGroup } from "./Layout"
import {ExistingClient} from "pages/payments/invoice/ExistingClient";


export interface ClientInformationProps extends StackProps {
  //onFinishUser: (client: client) => void
  cliente: client | undefined
  setCliente: Dispatch<SetStateAction<client | undefined>>
}

const n = (v: number | string) => typeof(v) === 'string' ? 0 : v;

export const ClientInformation = (props: ClientInformationProps) => {
  console.log("------.......");
  //console.log(props.displayBasic);
  const refExistingClient = useRef<HTMLFormElement>()
  
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  /*const [client, setClient] = useState<client|null>(null);
  const { onFinishUser, ...rest } = props;
  const handleSubmit = () => {
    onFinishUser(client!);
  }*/
  const handleInit = () => {
    if(refExistingClient.current == null){
      return;
    }
    refExistingClient.current.handleClick2(props.cliente)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  }

  useEffect(() => {
    handleInit();
  });



  return (
    <Stack border=''>
      <InformationAreaGroup>
        
        <InformationArea title='Cliente'>
          <ExistingClient setCliente={props.setCliente} ref={refExistingClient} />
        </InformationArea>

        
      </InformationAreaGroup>
      
	  

    </Stack>
    
  )
}