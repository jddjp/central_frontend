import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import { getProducts } from "services/api/products";
import { useQuery } from "react-query";
import Freshed from "./freshed";
import Inventory from "./inventory";
import Distribution from "./distribution";
import { Article } from "types/Article";
import OrderLibrador from "./ordersLibrador";
import { getOrderBySucursal } from "services/api/orders";
import { useState } from "react";
import { getSucursal } from "services/api/articles";

const TaskBox = () => {
  const auth = useAuth();
  const { data: products, refetch } = useQuery(["products"], getProducts);
  //const { data: sucursal } = useQuery(["sucursalPedido"], getSucursal)
  const [nameSuc, setNameSuc] = useState("");
  const [listPedidos, setLisPedidos] = useState();

  const changeTabs = async (index: Number) => {
    if (index == 1) {
      var callOrder = getOrderBySucursal();
      callOrder.then((ordenes: any) => {
        setLisPedidos(ordenes);
      });
    }
  };

  const getSucursalName = () => {
    const sucurs: Number = Number(localStorage.getItem("sucursal"));
    var s = getSucursal(sucurs);
    s.then((response) => {
      setNameSuc(response.attributes.nombre);
    });
    return nameSuc;
  };
  
  return (
    <Box mt="1rem" w="100%" mx="10">
      <Text fontWeight="bold" textAlign="end">
        {auth?.user?.roleCons}: {auth?.user?.username}{" "}
        {auth?.user?.apellido_paterno}
      </Text>
      <Text fontWeight="bold" textAlign="end">
        {" "}
        SUCURSAL: {getSucursalName()}{" "}
      </Text>
      <Tabs variant="enclosed" onChange={(index) => changeTabs(index)}>
        <TabList>
          <Tab>Recientes</Tab>
          {auth?.user?.roleCons === "Supervisor" && <Tab>Inventario</Tab>}
          {auth?.user?.roleCons === "Supervisor" && <Tab>Refill</Tab>}
          {(auth?.user?.roleCons === "Supervisor" ||
            auth?.user?.roleCons === "Receptor") && <Tab>Distribuidor</Tab>}
          {auth?.user?.roleCons === "Librador" && (
            <Tab tabIndex={3}>Pedidos</Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Freshed items={products} onHandleRefresh={refetch} />
          </TabPanel>
          {auth?.user?.roleCons === "Supervisor" && (
            <TabPanel>
              <Inventory
                items={products?.filter(
                  (e: Article) => e.attributes.fresh === false
                )}
              />
            </TabPanel>
          )}
          {auth?.user?.roleCons === "Supervisor" && (
            <TabPanel>
              <Inventory
                items={products?.filter(
                  (e: Article) => e.attributes.fresh === false
                )}
              />
            </TabPanel>
          )}
          {(auth?.user?.roleCons === "Supervisor" ||
            auth?.user?.roleCons === "Receptor") && (
            <TabPanel>
              <Distribution listOrder={listPedidos} />
            </TabPanel>
          )}
          {auth?.user?.roleCons === "Librador" && (
            <TabPanel tabIndex={3}>
              <OrderLibrador />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TaskBox;
