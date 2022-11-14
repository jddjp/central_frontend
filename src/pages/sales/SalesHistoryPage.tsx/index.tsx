import { useState } from 'react'
import { Box, Stack } from "@chakra-ui/react";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import moment from 'moment';
import { useQuery } from 'react-query';
import { getOrderEntregado } from 'services/api/orders';


const SalesHistoryPage = () => {

  const { data: orders } = useQuery(["orders"], getOrderEntregado)
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

  const onGlobalFilterChange1 = (e:any) => {
    setGlobalFilterValue1(e.target.value);
  }

  return (
    <Stack w="80%" mx="auto" mt="10" spacing="5">
      <DataTable paginator className="p-datatable-customers" showGridlines rows={10} 
        value={orders?.map((order: any) => order.attributes)}
        header={
          <Box display='flex' justifyContent='flex-start'>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Filtrar por nombre de cliente..." />
            </span>
          </Box>
        } 
        filters={{
          'cliente.data.attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
        }}> 
        <Column field="estatus" header="Estatus" />
        <Column field="fecha_pedido" header="Fecha Pedido" sortable  />
        <Column  header="Hora Pedido" body={(data:any) => {
          return moment(data.hora_pedido, 'hhmm ').format('hh:mm a')
        }}/>
        <Column field="comentario" header="Comentario" style={{width: '35%'}}/>
        {<Column field="cliente.data.attributes.nombre" header="Cliente"/>}
      </DataTable>
    </Stack>
  );
};

export default SalesHistoryPage