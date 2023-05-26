import { Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import { getProducts } from "services/api/products";
import { useQuery } from "react-query";
import Freshed from "./freshed";
import Inventory from "./inventory";
import Distribution from "./distribution";
import { Article } from "types/Article";

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
          <Tab>Distribuidor</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Freshed items={products?.filter((e: Article) => e.attributes.fresh === true)} onHandleRefresh={refetch}/>
          </TabPanel>
          <TabPanel>
            <Inventory items={products?.filter((e: Article) => e.attributes.fresh === false)}/>
          </TabPanel>
          <TabPanel>
            <Distribution/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TaskBox;