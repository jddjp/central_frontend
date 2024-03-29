import { AspectRatio, Box, Button, Image, Skeleton, Stack, StackProps, Tab, TabList, TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import { ShoppingCartArticle } from "./types";
import { extractStock } from "services/api/stocks";
import { useQuery } from "react-query";
import { BASE_URL } from "../../../config/env";

interface ArticleCardProps extends StackProps {
  article: ShoppingCartArticle;
}

const MotionStack = motion(Stack);

export const ArticleCard = (props: ArticleCardProps) => {
  const { article, children, ...rest } = props;
  const { nombre, descripcion } = article.attributes;
  const { data: stock } = useQuery(['stock', props.article.id], () => extractStock(props.article.id))

  return (
    <Tabs isLazy={true}>
      <TabList>
        <Tab>Resumen</Tab>
        <Tab>Detalles</Tab>
      </TabList>

      <TabPanels>
        <TabPanel key="resume">
          <Stack spacing="6" {...rest}>
            <Stack spacing="3">
              <Box width="60%" alignSelf="center">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={`${BASE_URL}${props?.article?.attributes?.foto?.data?.attributes?.url}`}
                    alt={nombre}
                    draggable="false"
                    fallback={<Skeleton />}
                    borderRadius={"md"}
                  />
                </AspectRatio>
              </Box>
            </Stack>

            <Stack dir="column" w="full">
            {stock?.stock === 0 ? 
                <Button colorScheme="brand" disabled marginTop='4rem'>
                  Sin Stock
                </Button> : children
              }
            </Stack>
          </Stack>
        </TabPanel>

        <TabPanel key="details">
          <MotionStack
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            <Stack spacing="5">
              <Stack>
                <Text fontWeight="semibold">Descripción</Text>
                <Text>
                  {descripcion || "No hay una descripción disponible."}
                </Text>
              </Stack>

              <Stack>
                <Text fontWeight="semibold">Unidad</Text>
                <Text>
                  {stock?.medida !== '' ? stock?.medida :
                    "No hay una unidad de medida asignada."}
                </Text>
              </Stack>

              <Stack>
                <Text fontWeight="semibold">Cantidad</Text>
                <Text>
                  {stock?.stock ?? 0}
                </Text>
              </Stack>
            </Stack>
          </MotionStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
