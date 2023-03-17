import { useState } from 'react'
import { Box } from "@chakra-ui/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"; 
import { InputNumber } from "primereact/inputnumber";
import { useMutation } from 'react-query';
import { sumStock } from 'services/api/stocks';

interface PropsReceiveArticle {
  headerTitle: String | undefined,
  isVisible: boolean,
  idProduct: number | undefined,

  onHandleHide: () => void,
  onHandleAgree?: () => void
}

const RecieveArticle = (props: PropsReceiveArticle) => {

  const { mutate } = useMutation(() => sumStock(props.idProduct, stock), {
    onSuccess: () => {
      setStock(0)
      props.onHandleHide()
    }
  })
  const [stock, setStock] = useState(0)

  const onHandleChange = (e: any) => {
    setStock(e.value)
  }

  const deleteProductDialogFooter = (
    <Box display='flex' justifyContent='space-between'> 
      <InputNumber value={stock} onChange={onHandleChange} placeholder='Cantidad recibida'/>
      <Button label="Ingresar" icon="pi pi-check" className="p-button-text" onClick={() => mutate()} />
    </Box>
  );

  return ( 
    <Dialog style={{ width: '550px' }} header={props.headerTitle} modal 
    footer={deleteProductDialogFooter} 
    onHide={props.onHandleHide}
    visible={props.isVisible}>
      <Box height='10rem'>
      </Box>
    </Dialog>
  );
}

export default RecieveArticle;