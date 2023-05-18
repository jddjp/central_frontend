import { useState } from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { Article } from "../../types/Article";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";
import { TiLockClosed, TiTag } from "react-icons/ti";
import RecieveArticle from "../../components/modals/ReceiveArticle";
import moment from "moment";
import { IoMdCalendar, IoMdClock } from "react-icons/io";
import { useQuery } from "react-query";
import { getOrderDistribution } from "services/api/orders";
const BASE_URL = process.env.REACT_APP_BASE_URL;

interface DistributionProps {
  items: Article[];
}

const Distribution = () => {
  const { data: orders } = useQuery(["orders"], getOrderDistribution);

  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);

  const OpenDialog = (data: any) => {
    setSelectedOrder(data);
    setVisible(true);
  };
  const closeDialog = () => {
    setVisible(false);
  };

  const itemTemplate = (order: any) => {
    return (
      <Box display="flex">
        <Box display="flex" w="100%" gap="3">
          <Box display="flex" justifyContent="space-between" w="100%">
            <Box>
              <Text fontWeight="bold">{order.attributes.comentario}</Text>
              <Box display="flex" alignItems="center" gap="2">
                <IoMdClock />
                <Text>{order.attributes.estatus}</Text>
              </Box>
              <Box display="flex" alignItems="center" gap="2">
                <IoMdCalendar />
                <Text>{moment(order.attributes.fecha_pedido).format("L")}</Text>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" marginRight="5">
              <Button
                icon="pi pi-eye"
                className="p-button-rounded"
                onClick={() => OpenDialog(order)}
              ></Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box w="70%" m="auto" mt="3">
        <ListBox
          filter
          value={selectedOrder}
          options={orders}
          optionLabel="attributes.comentario"
          itemTemplate={itemTemplate}
        />
      </Box>
      <RecieveArticle
        isVisible={visible}
        onHandleHide={closeDialog}
        headerTitle={selectedOrder?.attributes.comentario}
        idProduct={selectedOrder?.id}
        toogle="distribution"
      />
    </>
  );
};

export default Distribution;
