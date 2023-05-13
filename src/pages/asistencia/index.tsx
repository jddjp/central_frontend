import { Box, Stack } from '@chakra-ui/react';
import { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getSesiones, deleteSesiones } from 'services/api/Auth';
import { Dropdown } from 'primereact/dropdown';
import { useToast } from '@chakra-ui/react';
import moment from 'moment';

export default function Asistencia (){
  const queryClient = useQueryClient()
  const { data: sesiones } = useQuery(["sesion"], getSesiones);
  const deleteSesion = useMutation(deleteSesiones);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [fecha, setFecha] = useState(null);
  const toast = useToast();

  const onGlobalFilterChange1 = (e:any) => {
        setGlobalFilterValue1(e.target.value);
  }
 
  const open = (data :  any) => {
    toast({
      title: 'Eliminando el registro',
      description: "Procesando...",
      status: 'warning',
      duration: 2000,
      isClosable: true,
    })
    deleteSesion.mutate({sesion: data}, {
      onSuccess: () => {
        queryClient.invalidateQueries(['sesion']);
         toast({
          title: 'Eliminado el registro...',
          description: "Se ha eliminado correctamente el registro seleccionado",
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
      }
    }); 
   }

  return (
    <Stack w="80%" mx="auto" mt="10" spacing="10" display='flex'>
      <DataTable   width="80%" 
        header={
          <Stack spacing={8} direction='row'>
            <Box display='flex' justifyContent='flex-start'>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Filtrar por nombre..." />
              </span>
            </Box>
            <Box  display='flex' justifyContent='flex-end'>
                <Dropdown   placeholder="Filtrado por fecha..." value={fecha} options={sesiones?.map((element:any)=>{return(element.attributes.fecha_registro)})} onChange={(e) => setFecha(e.value)} className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
            </Box>
          </Stack>
          } 
          filters={{
            'attributes.user.data.attributes.username': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH },
            'attributes.fecha_registro': { value: fecha, matchMode: FilterMatchMode.STARTS_WITH }
          }}
          globalFilterFields={['attributes.fecha_registro']}
          value={ sesiones?.map((element: any) => {return(element)})}
        >
          <Column field="attributes.user.data.attributes.username" header="Nombre" />
          <Column field="attributes.fecha_registro" header="Fecha" />
          <Column header="Hora de entrada" body={(data:any) => {
              return moment(data.attributes.hora_registro, 'hhmm ').format('hh:mm a')
          }}/>
            <Column header="" body={(data: any) => (
                <>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger mr-2 p-button-text"
                    title='Eliminar Registro'
                    onClick={() => open(data)}
                  />
                </>
              )}
              exportable={false}
              style={{ minWidth: "8rem" }}/>
      </DataTable>
    </Stack>  
  )

}




