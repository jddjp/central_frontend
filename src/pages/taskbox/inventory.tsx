import { useState } from 'react'
import { Box, Image, Text } from '@chakra-ui/react'
import { Article } from "../../types/Article";
import { ListBox } from 'primereact/listbox'
import { Button } from "primereact/button";
import { TiTag } from 'react-icons/ti'
import RecieveArticle from "../../components/modals/ReceiveArticle";
import moment from 'moment';
import { IoMdCalendar } from 'react-icons/io';
const BASE_URL = process.env.REACT_APP_BASE_URL

interface InventoryProps {
  items: Article[]
}

const Inventory = (props: InventoryProps) => {

  const [selectedProduct, setSelectedProduct] = useState<Article>();
  const [visible, setVisible] = useState<boolean>(false)

  const OpenDialog = (data: Article) => {
    setSelectedProduct(data)
    setVisible(true)
  }
  const closeDialog = () => {
    setVisible(false)
  }

  const itemTemplate = (product: Article) => {
    return (
      <Box display='flex'>
        <Box display='flex' w='100%' gap='3'>
          <Image borderRadius='20px' minWidth='160px' objectFit='cover' height='100px' src={`${BASE_URL}${product.attributes?.foto?.data?.attributes?.url}`}  fallbackSrc='https://as2.ftcdn.net/v2/jpg/01/07/57/91/1000_F_107579124_mIWzq85htygJBSKdAURrW5zcDNTSFTAr.jpg'/>
            <Box display='flex' justifyContent='space-between' w='100%'>
              <Box>
                <Text fontWeight='bold'>{product.attributes.nombre}</Text>
                <Box display='flex' alignItems='center' gap='2'>
                  <TiTag/>
                  <Text>{product.attributes.categoria}</Text>
                </Box>
                <Box display='flex' alignItems='center' gap='2'>
                  <IoMdCalendar/>
                  <Text>{moment(product.attributes.createdAt).format('L, h:mm:ss a')}</Text>
                </Box>
              </Box>
              <Box display='flex' alignItems='center' marginRight='5'>
                <Button icon="pi pi-eye" className="p-button-rounded" onClick={() => OpenDialog(product)}></Button>
              </Box>
            </Box>
        </Box>
      </Box>
    );
  };

  return ( 
    <>
      <Box w='70%' m='auto' mt='3'>
        <ListBox filter value={selectedProduct} options={props.items} optionLabel='attributes.nombre' itemTemplate={itemTemplate}/>
      </Box>
      <RecieveArticle isVisible={visible} onHandleHide={closeDialog} headerTitle={selectedProduct?.attributes.nombre} idProduct={selectedProduct?.id} toogle='inventory'/>
    </> 
  );
}

export default Inventory;