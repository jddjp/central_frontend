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

const BASE_URL = process.env.REACT_APP_BASE_URL


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
            src={`${BASE_URL}${article?.attributes?.foto?.data?.attributes?.url}` ?? 'https://as2.ftcdn.net/v2/jpg/01/07/57/91/1000_F_107579124_mIWzq85htygJBSKdAURrW5zcDNTSFTAr.jpg'}
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
