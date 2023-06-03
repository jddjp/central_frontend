import { useState } from "react";
import { Badge, Box, Image, Text, Button, IconButton } from '@chakra-ui/react'
import { Article } from "../../types/Article";
import { ListBox } from 'primereact/listbox'
import { TiTag } from 'react-icons/ti'
import RecieveArticle from "../../components/modals/ReceiveArticle";
import { updateFreshProduct } from "services/api/products";
import { useMutation } from "react-query";
import { MdEdit } from "react-icons/md";
import { BASE_URL } from "../../config/env";

interface FreshedProps {
  items: Article[],
  onHandleRefresh: () => void
}

const Freshed = (props: FreshedProps) => {

  const [selectedProduct, setSelectedProduct] = useState<Article>();
  const [visible, setVisible] = useState<boolean>(false)
  const dispatchUpdate = useMutation(() => updateFreshProduct(selectedProduct?.id, false), {
    onSuccess: () => {
      props.onHandleRefresh()
      closeDialog()
    }
  })

  const OpenDialog = (data: Article) => {
    setSelectedProduct(data)
    setVisible(true)
  }
  const closeDialog = () => {
    setVisible(false)
  }

  const onRefreshSection = () => {
    dispatchUpdate.mutate()
  }

  const itemTemplate = (product: Article) => {
    return (
      <Box display='flex'>
        <Box display='flex' w='100%' gap='3'>
          <Image borderRadius='20px' minWidth='160px' objectFit='cover' height='100px' 
          src={`${BASE_URL}${product.attributes?.foto?.data?.attributes?.url}`}  fallbackSrc='https://as2.ftcdn.net/v2/jpg/01/07/57/91/1000_F_107579124_mIWzq85htygJBSKdAURrW5zcDNTSFTAr.jpg'/>
            <Box display='flex' justifyContent='space-between' w='100%'>
              <Box>
                <Text fontWeight='bold'>{product.attributes.nombre}</Text>
                <Box display='flex' alignItems='center' gap='2'>
                  <TiTag/>
                  <Text>{product.attributes.categoria}</Text>
                </Box>
                {product.attributes.fresh && (
                  <Badge colorScheme='red'>Nuevo</Badge>
                )}
              </Box>
              <Box display='flex' alignItems='center' marginRight='5'>
                <IconButton aria-label='show dialog' icon={<MdEdit/>} borderRadius='full' colorScheme='red' 
                onClick={() => OpenDialog(product)} fontSize='20px' size='lg'/>
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
      <RecieveArticle isVisible={visible} onHandleHide={closeDialog} headerTitle={selectedProduct?.attributes.nombre} idProduct={selectedProduct?.id}>
        <Button colorScheme='red' onClick={onRefreshSection}>
          Mover a inventario
        </Button>
      </RecieveArticle>
    </> 
  );
}

export default Freshed;