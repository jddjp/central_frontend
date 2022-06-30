import {
  HStack,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { appAxios } from 'config/api';
export const SearchBar = (props: StackProps) => {
  return <HStack {...props} />;
};

export const Sales = () => {
  const [sales, setSales] = useState([])
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  useEffect(() => {
    appAxios.get(`/pedidos?populate=cliente&filters[estatus]=pendiente`).then((response: { data: any; }) => {
      const data = response.data
      setSales(data.data)
    })
  }, []);
  const ped = sales.map((data: any) => {
    return data.attributes
  })
const items = ped.map((data:any) => {
console.log(data.hora_pedido);

})
// console.log(ped.hora_pedido);



  const onGlobalFilterChange1 = (e:any) => {
    const value = e.target.value;
    setGlobalFilterValue1(value);
}






  const filters = {
    'estatus': { value: 'pendiente', matchMode: FilterMatchMode.STARTS_WITH },
    'cliente.data.attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
}
const renderHeader1 = () => {
  return (
      <div className="flex justify-content-between">
          <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Filtrar por nombre de cliente..." />
          </span>
      </div>
  )
}
const header1 = renderHeader1();
  return (
    <>
<div className="card">
  <DataTable value={ped}  paginator className="p-datatable-customers" showGridlines rows={10} header={header1} filters={filters}> 
<Column field="estatus" header="Estatus" />
<Column field="fecha_pedido" header="Fecha Pedido" sortable/>
<Column  header="Hora Pedido"  body={(data:any) => {
  return moment(data.hora_pedido, 'hhmm ').format('hh:mm a')
}}/>
<Column field="comentario" header="Comentario" style={{width: '50%'}}/>
{/* <Column field="cliente.data.attributes.nombre" header="name"/> */}
</DataTable>
    
</div>

</>



  )

}



export const ListExistedOrdersPage = (props: StackProps) => {
  return (
    <Stack w="80%" mx="auto" mt="10" spacing="5">
     <Sales/>
    </Stack>
  );
};
