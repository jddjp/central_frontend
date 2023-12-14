import { useRef, useState } from "react";
import { Badge, Box, useToast } from "@chakra-ui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Confirmation from "components/modals/Confirmation";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import "./style.css";
import { deleteSucursal, getSucursales } from "services/api/articles";
import SucusalesDetail from "./modals/sucursales";

const SucursalesPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const idRef = useRef(0);
  const [newSucursal, setNewSucursal] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const { data: sucursales, refetch } = useQuery(["sucursalesCatalogue"], () =>
    getSucursales()
  );
  const removeSurcusal = useMutation(deleteSucursal);
  const openNewClient = () => {
    setNewSucursal(true)
    setVisibleEdit(true)
  };
  const openDialogEdit = (id: number) => {
    idRef.current = id;
    setNewSucursal(false)
    setVisibleEdit(true);
    
  };
  const hideDialogPut = () => {
    idRef.current = 0;
    setVisibleEdit(false);
  };
  const hideDialogDelete = () => {
    idRef.current = 0;
    setVisibleDelete(false);
  };
  const confirmDelete = (id: number) => {
    idRef.current = id;
    setVisibleDelete(true);
  };

  const handleDelete = () => {
    removeSurcusal.mutate(idRef.current, {
      onSuccess: () => {
        queryClient.invalidateQueries(["sucursalesCatalogue"]);
        toast({
          title: "La sucursal ha sido borrada",
          status: "warning",
        });
        hideDialogDelete();
      },
    });
  };
  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  };

  return (
    <Box paddingTop="5" display="flex" margin="auto">
      <DataTable
        paginator
        className="p-datatable-customers"
        showGridlines
        rows={10}
        editMode="row"
        value={sucursales?.map((sucursal: any) => sucursal)}
        header={
          <Box maxW="sm" justifyContent="flex-start">
            <Box p="6">
              <Box display="flex" alignItems="baseline">
                <Badge
                  borderRadius="full"
                  fontSize="16"
                  px="2"
                  colorScheme="teal"
                >
                  SUCURSALES
                </Badge>
              </Box>
            </Box>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue1}
                onChange={onGlobalFilterChange1}
              />

              <Button
                label="Nuevo"
                icon="pi pi-plus"
                className="p-button-success mr-2"
                onClick={openNewClient}
              />
            </span>
          </Box>
        }
        filters={{
          "attributes.nombre": {
            value: globalFilterValue1,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        }}
      >
        <Column field="attributes.nombre" header="Nombre" />
        <Column field="attributes.colonia" header="Colonia" />
        <Column field="attributes.codigo_postal" header="C.P" />
        <Column field="attributes.municipio" header="Municipio" />
        <Column field="attributes.estado" header="Estado" />

        {
          <Column
            header="Acciones"
            body={(data: any) => (
              <Box display="flex">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success"
                  style={{ marginRight: "5px" }}
                  onClick={() => openDialogEdit(data.id)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-warning"
                  style={{ marginRight: "5px" }}
                  onClick={() => confirmDelete(data.id)}
                />
              </Box>
            )}
            exportable={false}
            style={{ minWidth: "8rem" }}
          />
        }
      </DataTable>
      <Confirmation
        isVisible={visibleDelete}
        titleText={"¿Estas seguro de eliminar la sucursal?"}
        onHandleHide={hideDialogDelete}
        onHandleAgree={handleDelete}
      />

      <SucusalesDetail
        isVisible={visibleEdit}
        newSucursal = {newSucursal}
        onHandleHide={hideDialogPut}
        referenceId={idRef.current}
      ></SucusalesDetail>
    </Box>
  );
};

export default SucursalesPage;
