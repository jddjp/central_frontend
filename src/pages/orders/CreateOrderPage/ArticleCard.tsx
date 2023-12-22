import {
  AspectRatio,
  Box,
  Button,
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
  useToast,
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import { ShoppingCartArticle } from "./types";
// import { useQuery } from "react-query";
import { BASE_URL } from "../../../config/env";
// import { getStockBySucursal } from "services/api/subsidiary";
import { Dispatch, useEffect, useState } from "react";

interface ArticleCardProps extends StackProps {
  article: ShoppingCartArticle;
  amount: number;
  setAmount: Dispatch<number>;
  stock: any;
  //stocks:any;
  type: boolean;
  origen?: { bodega: number; sucursal: number; receptor: number; desc: string };
}

const MotionStack = motion(Stack);

export const ArticleCard = (props: ArticleCardProps) => {
  const toast = useToast();
  const { article, children, amount, setAmount, stock, type, origen, ...rest } =
    props;
  const { nombre, descripcion, cantidad_stock } = article.attributes;
  const [stockSu,setSuct] = useState(article.attributes.stocks.data[0].attributes.cantidad)
  useEffect(() => {
    if (amount > article.attributes.stocks.data[0].attributes.cantidad) {
      setAmount(1)
      toast({
        title: 'Stock excedido',
        description: 'Has sobrepasado el stock que tiene la sucursal',
        status: 'error'
      })
    }
  }, [amount, setAmount, 10, toast]);

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
              {false? (
                <Button colorScheme="brand" disabled marginTop="4rem">
                  Sin Stock
                </Button>
              ) : (
                children
              )}
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
                  {article?.attributes.unidad_de_medida.data.attributes
                    .nombre !== ""
                    ? article?.attributes.unidad_de_medida.data.attributes
                        .nombre
                    : "No hay una unidad de medida asignada."}
                </Text>
              </Stack>

              <Stack>
                <Text fontWeight="semibold">
                  {type
                    ? "Cantidad en la sucursal " + origen?.desc
                    : "Cantidad"}
                </Text>
                <Text>{stockSu ?? 0}</Text>
              </Stack>
            </Stack>
          </MotionStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
