// import { useState } from "react";
import { Badge, Box, IconButton, Text, useToast } from "@chakra-ui/react";
import { ListBox } from "primereact/listbox";
// import { Button } from "primereact/button";
// import RecieveArticle from "../../components/modals/ReceiveArticle";
import { IoMdCalendar } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { getOrderBySucursal, getOrderDistribution, updateOrder } from "services/api/orders";
import moment from "moment";
import { MdDone, MdOutlineHomeWork, MdTrolley } from "react-icons/md";
import { useState } from "react";

interface distibution {
  listOrder: any
}

const Distribution = (props : distibution) => {
  const toast = useToast();
  var orders: any[] = []
  const updateOrderCall = useMutation(updateOrder);
  var [orden, setOrder] = useState<any>();
  const receiveOrder = (ordenVal: any) => {
    ordenVal.attributes.estatus = "entregado";
    setOrder(ordenVal);
    HandleUpdateProduct();
  };

  const HandleUpdateProduct = async () => {
    updateOrderCall.mutate(orden, {
      onSuccess: async () => {
        toast({
          title: "El Pedido ha sido recido exitosamente!!",
          status: "warning",
        });
      },
      onError: async () => {
        orden.attributes.estatus = "pendiente";
        setOrder(orden);
      },
    });
  };
  const itemTemplate = (order: any) => {
    orden = order;
    return (
      <Box w="100%">
        <Box display="flex" justifyContent="space-between" w="100%">
          <Box mt="1.5">
            <Box display="flex" alignItems="center" gap="3">
              <Text fontWeight="bold" fontSize="17">
                {order?.attributes?.comentario}
              </Text>
              <Badge
                colorScheme={
                  orden?.attributes?.estatus === "pendiente"
                    ? "yellow"
                    : "green"
                }
                marginBottom="1"
              >
                {orden?.attributes?.estatus}
              </Badge>
            </Box>
            <Box display="flex" alignItems="center" gap="2">
              <IoMdCalendar />
              <Text>{moment(order?.attributes?.createdAt).format("L")}</Text>
            </Box>
            <Box display="flex" alignItems="center" gap="2">
              <MdOutlineHomeWork />
              <Text>
                {order?.attributes?.sucursal?.data?.attributes?.nombre}
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap="2">
              <MdTrolley />
              <Text>{order?.attributes?.bodega?.data?.attributes?.nombre}</Text>
            </Box>
            <br />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            marginRight="5"
            hidden={order?.attributes?.estatus === "pendiente" ? false : true}
          >
            <IconButton
              data-pr-tooltip="Recibido"
              aria-label="show dialog"
              icon={<MdDone />}
              borderRadius="full"
              colorScheme="green"
              onClick={() => receiveOrder(order)}
              fontSize="30px"
              size="lg"
            />
          </Box>
        </Box>
      </Box>
    );
  };
  if (props.listOrder != undefined) {
    props.listOrder.forEach((orden: any) => {
      orders.push(orden)
    });
  }
  return (
    <>
      <Box w="70%" m="auto" mt="3">
        <ListBox
          filter
          options={orders}
          optionLabel="attributes.comentario"
          itemTemplate={itemTemplate}
        />
      </Box>
    </>
  );
};

export default Distribution;
