import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useToast,
  HStack,
  Text,
  Spacer,
  Badge,
  Center,
} from "@chakra-ui/react";
import { ArticleCard } from "pages/orders/CreateOrderPage/ArticleCard";
import { Formik } from "formik";
import { PriceBreakage } from "types/Article";
import {
  Counter,
  DecrementButton,
  IncrementButton,
  InputCounter,
} from "components/Counter";
import { useEffect, useRef, useState } from "react";
import { EditablePrice } from "components/EditablePrice";
import { ShoppingCartArticle, ShoppingCartItem } from "./types";
import { pricingCalculator } from "helpers/pricingCalculator";
import { useQuery } from "react-query";
import { getStockBySucursal } from "services/api/subsidiary";

export interface AddItemModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  article: ShoppingCartArticle | null;
  onAddItemModal: (item: ShoppingCartItem) => void;
  type: boolean;
  origen?: { bodega: number; sucursal: number; receptor: number; desc: string };
}

export const AddItemModal = (props: AddItemModalProps) => {
  const { isOpen, onClose, article, onAddItemModal, type, origen } = props;
  const toast = useToast();
  const tagRef = useRef(0);
  const [customPrice, setCustomPrice] = useState<number | undefined>(0);
  const [discountPrices, setDiscountPrices] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [priceBreakage, setPriceBreakage] = useState<PriceBreakage[] | null>(
    null
  );
  const { data: stock } = useQuery(["stock", article?.id], () => {
    if (article != null) {
      return getStockBySucursal(article!.id);
    } else {
      return [];
    }
  });
  useEffect(() => {
    try {
      const { price, tag } = pricingCalculator(
        //article?.attributes.ruptura_precio.data.attributes.rangos,
        article?.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
        amount!
      );
      console.log("price: " + price);
      
  
      setCustomPrice(price);
      tagRef.current = tag;
    } catch (erro) {

      if (!type) {
        toast({
          status: "error",
          description: "Articulo podria no tener ruptura disponible",
        });
      }
    }
  }, [amount, article, toast]);

  useEffect(() => {
    if (priceBreakage !== null) {
      if (priceBreakage?.length > 0 && typeof amount !== "undefined") {
        const prices = priceBreakage.filter((element) => {
          if (
            amount >= element.attributes.peso_inferior &&
            amount <= element.attributes.peso_superior
          ) {
            return element;
          }
        });
        if (prices.length > 0) {
          setDiscountPrices(prices[0].attributes.descripcion_descuento);
          setCustomPrice(prices[0].attributes.precio);
        } else {
          setDiscountPrices("");
          setCustomPrice(undefined);
        }
      }
    }
  }, [amount, priceBreakage]);

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.trim().length === 0) {
      setAmount(1);
    } else {
      if (type) {
        if (article?.attributes.cantidad_stock! < Number(event.target.value)) {
          toast({
            title: "Uppps!!!",
            description: "No hay suficiente Stock en la sucursal",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      }
      setAmount(Number(event.target.value));
    }
  };

  const handleStepAmount = (step: number) => {
    if (type) {
      if (article?.attributes.cantidad_stock! < amount) {
        toast({
          title: "Uppps!!!",
          description: "No hay suficiente estock en la sucursal",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });

        return () => setAmount(article?.attributes.cantidad_stock!);
      } else {
        return () => setAmount((prev) => (prev || 0) + step);
      }
    } else {
      return () => setAmount((prev) => (prev || 0) + step);
    }
  };

  const closeAndReset = () => {
    setAmount(1);
    onClose();
  };

  const handleAdd = () => {
    try {
      onAddItemModal({
        article: article!,
        amount: amount!,
        customPrice: customPrice,
        priceBroken: tagRef.current,
        unidad: stock?.attributes.unidad_de_medida.data.attributes.nombre,
      });
      toast({
        title: "Artículo agregado.",
        description: `${article!.attributes.nombre} x ${amount}`,
        status: "success",
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: "Artículo existente.",
        description: e.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      closeAndReset();
    }
  };

  return (
    <>
      {article?.attributes.ruptura_precio.data !== null ? (
        <Modal
          isCentered
          size="2xl"
          colorScheme="brand"
          isOpen={isOpen}
          onClose={closeAndReset}
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent h="575px">
            <ModalHeader>Agregando {article?.attributes.nombre}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Formik initialValues={{}} onSubmit={(e) => {}}>
                <ArticleCard
                  maxW="100%"
                  article={article!}
                  amount={amount}
                  setAmount={setAmount}
                  stock={stock}
                  type={type}
                  origen={origen}
                >
                  <>
                    <HStack>
                      <Text fontWeight="semibold" mb="-1">
                        Precio
                      </Text>
                      <Spacer />
                      {discountPrices ? (
                        <>
                          <Center>
                            <Badge p={2} colorScheme="green">
                              % {discountPrices}{" "}
                            </Badge>
                          </Center>
                          <Text fontWeight="semibold"> $ {customPrice} </Text>
                        </>
                      ) : (
                        <EditablePrice
                          originalPrice={customPrice!}
                          onSetCustomPrice={setCustomPrice}
                        />
                      )}
                    </HStack>
                    <Counter>
                      <DecrementButton onClick={handleStepAmount(-1)} />
                      <InputCounter
                        min="1"
                        name="counter"
                        colorScheme="brand"
                        value={amount}
                        onChange={handleChangeAmount}
                      />
                      <IncrementButton onClick={handleStepAmount(+1)} />
                    </Counter>

                    <Button colorScheme="brand" onClick={handleAdd}>
                      Agregar
                    </Button>
                  </>
                </ArticleCard>
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
};
