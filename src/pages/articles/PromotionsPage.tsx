import { Badge, Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import { getPromotions } from "services/api/promotions";
import { useQuery } from "react-query";
import { BASE_URL } from "../../config/env";
import "./style.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Confirmation from "components/modals/Confirmation";
import { FilterMatchMode } from "primereact/api";
import Promotion from "components/modals/Promotion";

const PromotionsPage = () => {
  //const { data: products,refetch } = useQuery(["products"]
  const { data: promotions } = useQuery(["promotions"], getPromotions);
  const [rolFlag, setRolFlag] = useState(true);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  };

  const openNewPromotion = () => {
    setVisibleCreate(true);
  };
  const openDialogEdit = (id: number) => {
    setVisibleEdit(true);
  };
  const confirmDelete = (id: number) => {
    setVisibleDelete(true);
  };

  const hideDialogPost = () => {
    setVisibleCreate(false)
  }
  
  const handleCreateOrder = (id: number) => {};

  return (
    <Box paddingTop="5" display="flex" margin="auto">
      <DataTable
        paginator
        className="p-datatable-customers"
        showGridlines
        rows={10}
        editMode="row"
        value={promotions?.map((promotion: any) => promotion)} 
        header={
          <Box maxW="sm" justifyContent="flex-start">
            <Box p="6">
              <Box display="flex" alignItems="baseline">
                <Badge borderRadius="full"  fontSize="16" px="2" colorScheme="teal">
                  PROMOCIONES
                </Badge>
              </Box>
            </Box>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue1}
                onChange={onGlobalFilterChange1}
              />
              {rolFlag && (
                <Button
                  label="New"
                  icon="pi pi-plus"
                  className="p-button-success mr-2"
                  onClick={openNewPromotion}
                />
              )}
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
        <Column field="attributes.descripcion" header="Descripcion" />
        <Column field="attributes.fecha_inicio" header="F. Inicio" />
        <Column field="attributes.fecha_fin" header="F. Fin" />
        <Column field="attributes.articulo.data.attributes.nombre" header="Articulo" />
        <Column field="attributes.estado" header="Estado" />
      
        {rolFlag && (
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
                <Button
                  icon="pi pi-box"
                  className="p-button-rounded p-button-secondary"
                  onClick={() => handleCreateOrder(data.id)}
                />
              </Box>
            )}
            exportable={false}
            style={{ minWidth: "8rem" }}
          />
        )}
      </DataTable>

      {/* Modals 
    <Confirmation 
    isVisible={visibleDelete} 
    titleText='¿Estas seguro que quieres que eliminarlo?'
    onHandleHide={hideDialogDelete} 
    onHandleAgree={handleDeleteProduct}/>

    <ArticlePostDetail isVisible={visibleCreate} onHandleHide={hideDialogPost}/> 
    <ArticlePutDetail isVisible={visibleEdit} onHandleHide={hideDialogPut} referenceId={idRef.current} referenceSucursal={currentStore}/>
    <OrdenRefill ref={(ordenRefillRef)} onHandleHide={hideDialogOrder} referenceId={idRef.current} ></OrdenRefill>
        */}
    <Promotion isVisible={visibleCreate} onHandleHide={hideDialogPost}/>
    </Box>
  );
};

export default PromotionsPage;
