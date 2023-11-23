import {
  Badge,
  Box,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import { deletePromotion, getPromotions } from "services/api/promotions";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BASE_URL } from "../../config/env";
import "./style.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Confirmation from "components/modals/Confirmation";
import { FilterMatchMode } from "primereact/api";
import Promotion from "components/modals/Promotion";
import { deleteStock } from "services/api/stocks";

const PromotionsPage = () => {
  const queryClient = useQueryClient();
  var rol = localStorage.getItem("role");
  const idRef = useRef(0);
  const { data: promotions } = useQuery(["promotions"], getPromotions);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const removePromotion = useMutation(deletePromotion);
  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  };

  const openNewPromotion = () => {
    setVisibleCreate(true);
  };
  const confirmDelete = (id: number) => {
    idRef.current = id;
    setVisibleDelete(true);
  };

  const hideDialogPost = () => {
    setVisibleCreate(false);
  };
  var payments: any[] = [];
  const hideDialogDelete = () => {
    idRef.current = 0;
    setVisibleDelete(false);
  };

  const handleDeleteProduct = () => {
    removePromotion.mutate(idRef.current, {
      onSuccess: () => {
        queryClient.invalidateQueries(["promotions"]);
        hideDialogDelete();
      },
    });
  };

  if (promotions != undefined) {
    promotions.forEach((promocion: any) => {
      payments.push(
        <Card maxW="sm">
          <CardBody>
            <Image
              src="https://img.freepik.com/psd-premium/plantilla-supermercado-redes-sociales-grandes-ofertas-brasil_220664-1178.jpg?w=826"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">{promocion.attributes.descripcion}</Heading>
              <Text>2 x 1 todos los viernes</Text>
              <Text color="blue.600" fontSize="2xl">
                $450
              </Text>
            </Stack>
          </CardBody>

          <CardFooter></CardFooter>
        </Card>
      );
    });
  }
  return (
    <Box paddingTop="5" display="flex" margin="auto">
      {rol == "Supervisor" && (
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
                  <Badge
                    borderRadius="full"
                    fontSize="16"
                    px="2"
                    colorScheme="teal"
                  >
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
                {
                  <Button
                    label="New"
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    onClick={openNewPromotion}
                  />
                }
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
          <Column
            field="attributes.articulo.data.attributes.nombre"
            header="Articulo"
          />
          <Column field="attributes.estado" header="Estado" />

          {
            <Column
              header="Acciones"
              body={(data: any) => (
                <Box display="flex">
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
      )}

      {rol != "Supervisor" && (
        <Box>
          <Text as="b" fontSize="25px" color="tomato" padding={2}>
            Promociones
          </Text>
          <Grid templateColumns="repeat(6, 2fr)" gap={6}>
            {payments}
          </Grid>
        </Box>
      )}
      <Confirmation
        isVisible={visibleDelete}
        titleText="¿Estas seguro que quieres que eliminarlo?"
        onHandleHide={hideDialogDelete}
        onHandleAgree={handleDeleteProduct}
      />
      <Promotion isVisible={visibleCreate} onHandleHide={hideDialogPost} />
    </Box>
  );
};

export default PromotionsPage;
