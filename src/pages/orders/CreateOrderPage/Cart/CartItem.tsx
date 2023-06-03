import { Box, CloseButton, Flex, Input, Link, Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,IconButton, useDisclosure, FormLabel, NumberInput, NumberInputField, useToast, Badge
 } from "@chakra-ui/react";
import { EditIcon } from 'components/icons';
import { PriceTag } from "components/PriceTag";
import { CartProductMeta } from "./CartProductMeta";
import { getFinalPrice } from "../useCart/reducer";
import { ChangeEvent, useEffect, useState } from "react";
import { ShoppingCartItem } from "../types";
import { useQueryClient } from 'react-query';
import { BASE_URL } from "../../../../config/env";

type CartItemProps = {
  item: ShoppingCartItem;
  onClickDelete: VoidFunction;
  onChangeItemAmount: (amount: number) => void;
  onChangePriceItem: (newprice: number) => void;
};


export const CartItem = (props: CartItemProps) => {
  
  const { item, onClickDelete, onChangeItemAmount,onChangePriceItem } = props;
  const queryCache = useQueryClient()
  const query : any = queryCache.getQueryData(['stock', item.article.id])
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();
  const [newPrice, setNewPrice] = useState<Number>();
  const [colorAlert, setColorAlert] = useState<string>('');
  const [showBadge , setShowBadge] = useState<Boolean>(false);
  const { amount, customPrice } = item;
  const { descripcion, nombre, precio_lista } = item.article.attributes;
  const imageUrl = `${BASE_URL}${props?.item?.article?.attributes?.foto?.data?.attributes?.url}`

  useEffect(() => {
    if (customPrice !== undefined && amount < 0) {
      setShowBadge(true);
      setColorAlert('purple');
    }else if(customPrice !== undefined){
      setShowBadge(true);
      setColorAlert('blue');
    }else if(amount < 0){
      setShowBadge(true);
      setColorAlert('red');
    }else{setShowBadge(false);}
  }, [customPrice,amount]);

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeItemAmount(Number(e.target!.value));
  };

  const handleChangePriceItem = () =>{
    if(newPrice || newPrice !== 0){
      onClose();
      onChangePriceItem(Number(newPrice));
      toast({
        title: "Precio Modificado",
        status: "success",
        isClosable: true,
      });
      setNewPrice(0);
    }else{
      toast({
        title: "Ingrese un nuevo precio valido",
        status: "warning",
        isClosable: true,
      });
    };
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
    >
      <CartProductMeta
        name={nombre}
        description={descripcion}
        image={imageUrl}
      />
      <Badge style={showBadge ? {} : { display: 'none' }} mx='2' p='4' sx={{ borderRadius: "50%" }} fontSize='0.8em' colorScheme={colorAlert}></Badge>

      {/* Desktop */}
      <Flex
        width="full"
        justify="space-between"
        display={{ base: "none", md: "flex" }}
      >
        <Box>
          <Input
            value={amount}
            //min="1"
            type="number"
            display="inline"
            w="100px"
            variant="filled"
            rounded="md"
            onChange={handleChangeAmount}
          />
          <Popover>
            <PopoverTrigger> 
              <Button colorScheme='gray' variant='ghost'>  
                <Text display="inline" ml="2">
                  { query?.medida || "No hay una unidad de medida disponible."}
                </Text>
              </Button>
            </PopoverTrigger>
            <PopoverContent width="inherit">
              <PopoverArrow />
              <PopoverBody>{`${amount} ${query?.medida || ''} x $${customPrice ? customPrice : precio_lista} p.u. = $${(customPrice ? customPrice : precio_lista)*amount}`}</PopoverBody>
            </PopoverContent>
          </Popover>

        </Box>
        <Box>
          <Flex>
            <PriceTag
              price={precio_lista}
              salePrice={customPrice}
              currency={"MXN"}
            />
            <Popover
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              placement='top-end'
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <IconButton 
                  aria-label='Editar precio'        
                  size='sm'
                  colorScheme="gray"
                  icon={<EditIcon />}
                  variant="ghost"/>
              </PopoverTrigger>
              <PopoverContent p={2} width="inherit">
                <PopoverArrow />
                  <FormLabel htmlFor='new-price'>💲 Nuevo Precio</FormLabel>
                  <Flex gap='2'>
                    <NumberInput size='sm' id='new-price'>
                      <NumberInputField onChange={e => setNewPrice(parseInt(e.target.value))} />
                    </NumberInput>
                    <Button variant='outline' colorScheme='whatsapp' size='sm' onClick={handleChangePriceItem}>Guardar</Button>
                  </Flex>
              </PopoverContent>
            </Popover>
          </Flex>
        </Box>
        <CloseButton
          aria-label={`Delete ${nombre} from cart`}
          onClick={onClickDelete}
        />
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{ base: "flex", md: "none" }}
      >
        <Link fontSize="sm" textDecor="underline" onClick={onClickDelete}>
          Delete
        </Link>
        <PriceTag price={getFinalPrice(item)} currency={"MXN"} />
      </Flex>
    </Flex>
  );
};

