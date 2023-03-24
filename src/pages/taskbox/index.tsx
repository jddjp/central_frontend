import { useState } from "react";
import { Box, Image, Text, Badge } from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import { getProducts } from "services/api/products";
import { useQuery } from "react-query";
import { Article } from "types/Article";
import { ListBox } from 'primereact/listbox'
import { Button } from "primereact/button";
import { TiTag } from 'react-icons/ti'
import RecieveArticle from "components/modals/ReceiveArticle";
const BASE_URL = process.env.REACT_APP_BASE_URL

const TaskBox = () => {
  const auth = useAuth();

  const [selectedProduct, setSelectedProduct] = useState<Article>();
  const [visible, setVisible] = useState<boolean>(false)
  const { data: products } = useQuery(["products"], getProducts)

  const OpenDialog = (data: Article) => {
    setSelectedProduct(data)
    setVisible(true)
  }
  const closeDialog = () => {
    setVisible(false)
  }

  console.log(products);

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
                {product.attributes.fresh && (
                  <Badge colorScheme='red'>Nuevo</Badge>
                )}
              </Box>
              <Box display='flex' alignItems='center' marginRight='5'>
                <Button icon="pi pi-pencil" className="p-button-rounded" onClick={() => OpenDialog(product)}></Button>
              </Box>
            </Box>
        </Box>
      </Box>
    );
};

  return ( 
    <Box mt='1rem' w='100%' mx='10'>
      <Text fontWeight='bold' textAlign='end'>RECEPTOR: {auth?.user?.username} {auth?.user?.apellido_paterno}</Text>
      <Box w='70%' m='auto' mt='3'>
        <ListBox filter value={selectedProduct} options={products} optionLabel='attributes.nombre' itemTemplate={itemTemplate}/>
      </Box>
      <RecieveArticle isVisible={visible} onHandleHide={closeDialog} headerTitle={selectedProduct?.attributes.nombre} idProduct={selectedProduct?.id} historial={selectedProduct?.attributes?.historial_numeros?.data}/>
    </Box>
  );
}

export default TaskBox;