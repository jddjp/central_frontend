import {
  Image,
  Text,
  AspectRatio,
  Box,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { ArticleAttributes } from "types/Article";
import { ContentType } from "types/core";
import { WithRequired } from "types/utils";

export interface CatalogueArticleProps {
  article: ContentType<WithRequired<ArticleAttributes, "foto">>;
}

export const CatalogueArticle = (props: CatalogueArticleProps) => {
  const { article } = props;
  return (
    <VStack position="relative">
      <Box
        display="inline"
        fontWeight="semibold"
        color="white"
        left="2"
        top="2"
        position="absolute"
        zIndex="2"
        fontSize="11"
        p={3}
        bg="brand.400"
        rounded="md"
      >
        $ {article.attributes.precio_lista}
      </Box>
      <Box width="80%" alignSelf="center">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={article.attributes.foto.data.attributes.url}
            alt={article.attributes.nombre}
            draggable="false"
            fallback={<Skeleton />}
            borderRadius={"md"}
            rounded="sm"
          />
        </AspectRatio>
      </Box>
      <Text textAlign="center" fontWeight="semibold">
        {article.attributes.nombre}
      </Text>
    </VStack>
  );
};
