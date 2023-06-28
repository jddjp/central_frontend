import { useState } from "react";
import { Box, Stack } from '@chakra-ui/react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from 'primereact/multiselect'
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import {deleteArticulosSustituto, getArticulosNoFiscal, getArticulosSustituto, updateArticulosSustituto } from 'services/api/articles';

const Contador = () => {

  const queryClient = useQueryClient()
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  
  const putArticleSustituto = useMutation(updateArticulosSustituto);
  const deleteArticleSustituto = useMutation(deleteArticulosSustituto);
  const { data: articulosNoFiscal } = useQuery(["articulosNoFiscal"], getArticulosNoFiscal);
  const { data: articulosFiscal } = useQuery(["articulosFiscal"], getArticulosSustituto, {
    select(data) {
      return data.map((article: any) => {
        return {
          id: article.id,
          name: article.attributes.nombre
        }
      })
    }
  });

  const onGlobalFilterChange1 = (e:any) => {
    setGlobalFilterValue1(e.target.value);
  }
  
  const onValidateUpdate = (initialTarget: any, toogle: number) => {
    let valid;

    for (let i = 0; i < initialTarget.length; i++) {
      console.log(initialTarget[i].attributes.articulo_sustituto.data.id);
      if (initialTarget[i].attributes.articulo_sustituto.data.id === toogle) {
        valid = {
          exist: true,
          refArticleSustituto: initialTarget[i].id
        }
      }
    }

    return valid ?? { exist: false }
  }

  const updateDialogArticulo = (refArticleSustituto: number, refArticle: number, data: any) => {
    const result = onValidateUpdate(data, refArticleSustituto)
  
    if (result.exist === true) {
      deleteArticleSustituto.mutate(result.refArticleSustituto, {
        onSuccess: () => {
          queryClient.invalidateQueries(['articulosNoFiscal'])
        }
      });
    } else {
      putArticleSustituto.mutate({articulo_sustituto: refArticleSustituto, articulo: refArticle}, {
        onSuccess: () => {
          queryClient.invalidateQueries(['articulosNoFiscal'])
        }
      });
    }
  }

  return (
    <Stack w="80%" mx="auto" mt="10" spacing="5">
      <DataTable width="80%" value={ articulosNoFiscal?.data.map((element: any) => element)}
        header={
        <Box display='flex' justifyContent='flex-start'>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Filtrar por nombre del artículo ..." />
          </span>
        </Box>
      } 
      filters={{
        'attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
      }}
      >
        <Column field="attributes.nombre" header="Nombre" />
        <Column field="attributes.descripcion" header="Descripción" />
        <Column field="attributes.inventario_fisico" header="Inventario Físico" />
        <Column field="attributes.inventario_fiscal" header="Inventario Fiscal" />
        <Column header="Artículos Sustitutos" body={(data: any) => (
            <MultiSelect options={articulosFiscal} optionLabel="name" value={data?.attributes?.articulos_sustitutos?.data?.map((sustituto: any) => {
              return {
                id: sustituto.attributes.articulo_sustituto.data.id,
                name: sustituto.attributes.articulo_sustituto.data.attributes.nombre
              }
            })} onChange={(e) => updateDialogArticulo(e.selectedOption.id, data.id, data?.attributes?.articulos_sustitutos?.data)} 
            placeholder="Escoge sustitutos" selectionLimit={3} className="w- md:w-20rem" maxSelectedLabels={1} showSelectAll={false}/>
          )}
          exportable={false}
          style={{ minWidth: "8rem" }}
        />
      </DataTable>
    </Stack>
  )
}

export default Contador;