import { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getOrderPendiente, deleteOrder } from "../../../services/api/orders";
import moment from "moment";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { useQuery, useMutation, useQueryClient } from "react-query";

const ListExistedOrdersPage = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { data: orders } = useQuery(["orders"], getOrderPendiente)
  const { mutate } = useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  };

  return (
    <Stack w="80%" mx="auto" mt="10" spacing="5">
      <DataTable paginator showGridlines rows={10} className="p-datatable-customers"
        value={orders?.map((order:any) => {
          order.attributes.id = order.id
          return order.attributes;
        })}
        header={
          <Box display='flex' justifyContent='space-between'>
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Filtrar por nombre de cliente..."
            />
          </span>
          </Box>
        }
        filters={{
          estatus: { value: "pendiente", matchMode: FilterMatchMode.STARTS_WITH },
          "cliente.data.attributes.nombre": {
            value: globalFilterValue1,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        }}>

        <Column field="estatus" header="Estatus" />
        <Column field="fecha_pedido" header="Fecha Pedido" sortable />
        <Column header="Hora Pedido"
          body={(data: any) => {
            return moment(data.hora_pedido, "hhmm ").format("hh:mm a");
          }}/>
        <Column field="comentario" header="Comentario" style={{ width: "50%" }}/>
        <Column field="cliente.data.attributes.nombre" header="Cliente" />
        <Column body={(data: any) => (
            <>
              <Button
                icon="pi pi-arrow-up-right"
                className="p-button-rounded p-button-success mr-2 p-button-text"
                onClick={() => navigate(`/orders/edit/${data.id}`)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-warning p-button-text"
                onClick={() => mutate(data.id)}
              />
            </>
          )}
          exportable={false}
          style={{ minWidth: "8rem" }}/>
      </DataTable>
    </Stack>
  );
};

export default ListExistedOrdersPage
