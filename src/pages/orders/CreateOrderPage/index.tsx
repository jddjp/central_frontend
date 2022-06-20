import { Portal, Stack, useDisclosure, Button} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Header } from './Header';
import { useCart } from './useCart';
import { CatalogueModal } from './CatalogueModal';
import { AddItemModal } from './AddItemModal';
import { AlertConfirmation } from 'components/AlertConfirmation';
import { useAddItemModal } from './useAddItemModal';
import { Formik } from 'formik';
import { CartOrderSummary } from './CartOrderSummary';
import { ArrowRightIcon } from 'components/icons';
import { Cart } from './Cart';
import { ClientInformation } from './ClientInformation';
import { PaymentDetails } from './PaymentDetails';
import { OrderMenu } from './OrderMenu';
import { ShoppingCartArticle } from './types';

const initialClient = {
  name: '',
};

const initialPayment = {
  effectiveAmount: 0,
  paycheckAmount: 0,
  creditCardAmount: 0,
  creditAmount: 0,
};

export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route);
  const { total, addItem, clear, removeItem, cart, changeItemAmount } =
    useCart();
  const {
    isOpenAddItemModal,
    onCloseAddItemModal,
    onOpenAddItemModal,
    article,
    setArticle,
  } = useAddItemModal();
  const {
    isOpen: isOpenCatalogueModal,
    onClose: onCloseCatalogueModal,
    onOpen: onOpenCatalogueModal,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmationClear,
    onClose: onCloseConfirmationClear,
    onOpen: onOpenConfirmationClear,
  } = useDisclosure();


  const handleSelectArticleOnCatalogueModal = (
    article: ShoppingCartArticle
  ) => {
    setArticle(article);
    onCloseCatalogueModal();
    onOpenAddItemModal();
  };

  const handleConfirmClearCart = () => {
    clear();
    onCloseConfirmationClear();
  };

  const handleSelectArticle = (article: ShoppingCartArticle | null) => {
    if (article) {
      setArticle(article);
      onOpenAddItemModal();
    } else {
      setArticle(article);
    }
  };

  return (
    <Formik
      initialValues={{ client: initialClient, payment: initialPayment }}
      onSubmit={() => {}}
    >
      <Stack spacing="3" w="80%" mx="auto" my="5">
        <OrderMenu
          onOpenCatalogueModal={onOpenCatalogueModal}
          onOpenConfirmationClear={onOpenConfirmationClear}
        />

        <Header
          selectedArticle={article}
          onSelectArticle={handleSelectArticle}
        />

        
        <ClientInformation  />

        <Cart
          minH="85vh"
          maxH="85vh"
          onOpenConfirmationClear={onOpenConfirmationClear}
          onChangeItemAmount={changeItemAmount}
          onRemoveItem={removeItem}
          cart={cart}
        />
        <PaymentDetails cart={cart} total={total} />



        <CartOrderSummary cart={cart} total={total}>
          <Button
            colorScheme="red"
            size="lg"
            fontSize="md"
            rightIcon={<ArrowRightIcon />}
            disabled={cart.items.length === 0}
            onClick={redirectTo('/orders/typeNote')}
          >
            Pagar
          </Button>
        </CartOrderSummary>

        <Portal>
          <CatalogueModal
            isOpen={isOpenCatalogueModal}
            onClose={onCloseCatalogueModal}
            onSelectArticle={handleSelectArticleOnCatalogueModal}
          />
          <AddItemModal
            isOpen={isOpenAddItemModal}
            onClose={onCloseAddItemModal}
            article={article}
            onAddItemModal={addItem}
          />
          <AlertConfirmation
            onClose={onCloseConfirmationClear}
            onConfirm={handleConfirmClearCart}
            onReject={onCloseConfirmationClear}
            isOpen={isOpenConfirmationClear}
            title="Confirmación"
            message={
              '¿Desear eliminar todos los elementos de la orden?.' +
              'Una vez realizada está acción no sera posible revertirla.'
            }
          />
        </Portal>
      </Stack>
    </Formik>
  );
};

export default CreateOrderPage;
