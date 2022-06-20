import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { ShoppingCartArticle } from "./types";

export const useAddItemModal = () => {
  const {
    isOpen: isOpenAddItemModal,
    onClose: onCloseAddItemModal,
    onOpen: onOpenAddItemModal,
  } = useDisclosure();

  const [article, setArticle] = useState<ShoppingCartArticle | null>(null);

  const handleClose = () => {
    setArticle(null);
    onCloseAddItemModal();
  };

  return {
    isOpenAddItemModal,
    onCloseAddItemModal: handleClose,
    onOpenAddItemModal,
    article,
    setArticle,
  };
};

