import {
  AspectRatio,
  Box,
  Image,
  Skeleton,
  Stack,
  StackProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCartArticle } from "./types";

interface ArticleCardProps extends StackProps {
  article: ShoppingCartArticle;
}

const MotionStack = motion(Stack);

export const ArticleCard = (props: ArticleCardProps) => {
  const { article, children, ...rest } = props;
  const { nombre, foto, descripcion, unidad_de_medida } = article.attributes;

  return (
    <Tabs isFitted isLazy={true}>
      <TabList>
        <Tab>Resumen</Tab>
        <Tab>Detalles</Tab>
      </TabList>

      <TabPanels as={AnimatePresence} exitBeforeEnter>
        <TabPanel key="resume">
          <Stack spacing="6" {...rest}>
            <Stack spacing="3">
              <Box width="60%" alignSelf="center">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={foto?.data.attributes.url}
                    alt={nombre}
                    draggable="false"
                    fallback={<Skeleton />}
                    borderRadius={"md"}
                  />
                </AspectRatio>
              </Box>
            </Stack>

            <Stack dir="column" w="full">
              {children}
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
                  {unidad_de_medida?.data.attributes.nombre ||
                    "No hay una unidad de medida asignada."}
                </Text>
              </Stack>
            </Stack>
          </MotionStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
