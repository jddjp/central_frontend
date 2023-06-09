// import { useState } from "react";
import { Badge, Box, Text } from "@chakra-ui/react";
import { ListBox } from "primereact/listbox";
// import { Button } from "primereact/button";
// import RecieveArticle from "../../components/modals/ReceiveArticle";
import { IoMdCalendar } from "react-icons/io";
import { useQuery } from "react-query";
import { getOrderDistribution } from "services/api/orders";
import moment from "moment";
import { MdOutlineHomeWork, MdTrolley } from "react-icons/md";

const Distribution = () => {
  const { data: orders } = useQuery(["orders"], getOrderDistribution);

  // const [selectedOrder, setSelectedOrder] = useState<any>();
  // const [visible, setVisible] = useState<boolean>(false);

  // const OpenDialog = (data: any) => {
  //   setSelectedOrder(data);
  //   setVisible(true);
  // };
  // const closeDialog = () => {
  //   setVisible(false);
  // };

  console.log(orders);

  const itemTemplate = (order: any) => {
    return (
      <Box w="100%">
        <Box display='flex' alignItems='center' gap='2'>
          <Text fontWeight="bold" fontSize='17'>{order.attributes.comentario}</Text>
          <Badge colorScheme="red" marginBottom='1'>{order.attributes.estatus}</Badge>
        </Box>
        <Box mt='1.5'>
            <Box display="flex" alignItems="center" gap="2">
              <IoMdCalendar />
              <Text>{moment(order.attributes.createdAt).format("L")}</Text>
            </Box>
          <Box display="flex" alignItems="center" gap="2">
            <MdOutlineHomeWork/> 
            <Text>{order.attributes.sucursal.data.attributes.nombre}</Text>
          </Box>
          <Box display="flex" alignItems="center" gap="2">
            <MdTrolley/>
            <Text>{order.attributes.bodega.data.attributes.nombre}</Text>
          </Box>
          {/* <Box display="flex" alignItems="center" marginRight="5">
            <Button
              icon="pi pi-eye"
              className="p-button-rounded"
              onClick={() => OpenDialog(order)}
            ></Button>
          </Box> */}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box w="70%" m="auto" mt="3">
        <ListBox
          filter
          // value={selectedOrder}
          options={orders}
          optionLabel="attributes.comentario"
          itemTemplate={itemTemplate}
        />
      </Box>
    </>
  );
};

export default Distribution;
