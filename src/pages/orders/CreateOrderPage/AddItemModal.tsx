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
import { useEffect, useState } from "react";
import { EditablePrice } from "components/EditablePrice";
import { getArticlePrices } from "services/api/articles";
import { ShoppingCartArticle, ShoppingCartItem } from "./types";

export interface AddItemModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  article: ShoppingCartArticle | null;
  onAddItemModal: (item: ShoppingCartItem) => void;
}

export const AddItemModal = (props: AddItemModalProps) => {
  const { isOpen, onClose, article, onAddItemModal } = props;
  const toast = useToast();
  const [customPrice, setCustomPrice] = useState<number | undefined>(
    article?.attributes.precio_lista
  );
  const [amount, setAmount] = useState<number | undefined>(1);
  const [_, setPrice] = useState<PriceBreakage[] | null>(null);

  useEffect(() => {
    if (article !== undefined && isOpen) {
      const fetchPrices = async () => {
        const prices = await getArticlePrices(article!);
        setPrice(prices.data);
      };

      fetchPrices();
    }
  }, [article, isOpen]);

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.trim().length === 0) {
      setAmount(undefined);
    } else {
      setAmount(Number(event.target.value));
    }
  };

  const handleStepAmount = (step: number) => {
    return () => setAmount((prev) => (prev || 0) + step);
  };

  const closeAndReset = () => {
    setAmount(1);
    onClose();
  };

  const handleAdd = () => {
    console.log({ article });
    try {
      onAddItemModal({
        article: article!,
        amount: amount!,
        customPrice: customPrice,
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
            <ArticleCard maxW="100%" article={article!}>
              <>
                <HStack>
                  <Text fontWeight="semibold" mb="-1">
                    Precio
                  </Text>
                  <Spacer />
                  <EditablePrice
                    originalPrice={article?.attributes.precio_lista ?? 0}
                    onSetCustomPrice={setCustomPrice}
                  />
                </HStack>
                {customPrice && (
                  <Text color="gray.400" fontSize="sm">
                    El precio original es de ${article?.attributes.precio_lista}
                  </Text>
                )}
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
  );
};

