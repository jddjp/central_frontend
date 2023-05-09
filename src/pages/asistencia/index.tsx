import React from 'react';
import { Box,Stack} from '@chakra-ui/react';
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';


export default function Asistencia (){
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const onGlobalFilterChange1 = (e:any) => {
        setGlobalFilterValue1(e.target.value);
      }
   
    return (
        <Stack w="80%" mx="auto" mt="10" spacing="5">
            <DataTable   width="80%" 
             header={
              <Box display='flex' justifyContent='flex-start'>
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Filtrar por nombre del trabajador ..." />
                </span>
              </Box>
            } 
            filters={{
              '': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
            }}
            >
                <Column field="" header="Nombre" />
                <Column field="" header="Fecha" />
                <Column field="" header="Hora de entrada" />
                <Column field="" header="Hora de salida" />
            </DataTable>
            
      </Stack> 
       
        
    )
}




