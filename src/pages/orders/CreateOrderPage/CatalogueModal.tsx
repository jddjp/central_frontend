import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useAsync } from "hooks/useAsync";
import { listArticles } from "services/api/articles";
import { ShoppingCartArticle } from "./types";
import { HoverOverlay } from "components/HoverOverlay";
import { CatalogueGrid } from "features/articles/CatalogueGrid";
import { CatalogueArticle } from "features/articles/CatalogueArticle";

const initialValues = {
  counter: 0,
};

export interface CatalogueModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  onSelectArticle: (article: ShoppingCartArticle) => void;
}

export const CatalogueModal = (props: CatalogueModalProps) => {
  const { isOpen, onClose, onSelectArticle } = props;
  const { status, value } = useAsync(listArticles);

  const handleSetSelectArible = (article: ShoppingCartArticle) => () =>
    onSelectArticle(article);

  return (
    <Modal
      isCentered
      size="6xl"
      colorScheme="brand"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Catálogo</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={10}>
          <Formik initialValues={initialValues} onSubmit={(e) => {}}>
            <Form>
              {status !== "success" ? (
                <p>Loading...</p>
              ) : (
                <CatalogueGrid>
                  {value.map((a : any) => (
                    <HoverOverlay
                      key={a.id}
                      wrapperProps={{
                        rounded: "sm",
                        cursor: "pointer",
                        onClick: handleSetSelectArible(a.attributes.articulo.data),
                      }}
                    >
                      <CatalogueArticle
                        article={a.attributes.articulo.data}
                      />
                    </HoverOverlay>
                  ))}
                </CatalogueGrid>
              )}
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
