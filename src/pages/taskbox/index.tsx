import { Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import { getProducts } from "services/api/products";
import { useQuery } from "react-query";
import Freshed from "./freshed";
import Inventory from "./inventory";
import Distribution from "./distribution";
import { Article } from "types/Article";
import OrderLibrador from "./ordersLibrador";

const TaskBox = () => {
  const auth = useAuth();
  const { data: products, refetch } = useQuery(["products"], getProducts)

  return ( 
    <Box mt='1rem' w='100%' mx='10'>
      <Text fontWeight='bold' textAlign='end'>{auth?.user?.roleCons}: {auth?.user?.username} {auth?.user?.apellido_paterno}</Text>
      <Tabs variant='enclosed'>
        <TabList>
          <Tab>Recientes</Tab>
          {auth?.user?.roleCons === 'Supervisor' && (
            <Tab>Inventario</Tab>
          )}
          {(auth?.user?.roleCons === 'Supervisor' || auth?.user?.roleCons === 'Despachador') && (
            <Tab>Distribuidor</Tab>
          )}
          {auth?.user?.roleCons === 'Librador' && (
            <Tab tabIndex={3}>Pedidos</Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Freshed items={products?.filter((e: Article) => e.attributes.fresh === true)} onHandleRefresh={refetch}/>
          </TabPanel>
          {auth?.user?.roleCons === 'Supervisor' && (
            <TabPanel>
              <Inventory items={products?.filter((e: Article) => e.attributes.fresh === false)}/>
            </TabPanel>
          )}
          {(auth?.user?.roleCons === 'Supervisor' || auth?.user?.roleCons === 'Despachador') && (
            <TabPanel>
              <Distribution/>
            </TabPanel>
          )}
          {auth?.user?.roleCons === 'Librador' && (
            <TabPanel tabIndex={3}>
              <OrderLibrador/>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TaskBox;