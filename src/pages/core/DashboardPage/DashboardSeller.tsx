import { Badge, Flex, Stack, Text, background } from "@chakra-ui/react";
import { Menu } from "components/Menu";
import { Option } from "components/Option";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "primeicons/primeicons.css";
import { getSucursal } from "services/api/articles";

export const DashboardSeller = () => {
  const navigate = useNavigate();
  const [color, changeColor] = useState("Hola");

  const optionsSupervisor = [
    { name: "Ingresar pedido", route: "/orders/new" },
    { name: "Pedidos existentes", route: "/orders" },
    { name: "Historial de venta", route: "/sales" },
    { name: "Promociones", route: "/promotions" },
    { name: "Cátalogo", route: "/catalogue" },
    // {name: 'Articulos', route: '/articulos'},
    { name: "Lista de Asistencia", route: "/asistencia" },
  ];
  const optionsCajero = [
    { name: "Ingresar pedido", route: "/orders/new" },
    { name: "Pedidos existentes", route: "/orders" },
    { name: "Promociones", route: "/promotions" },
    { name: "Historial de venta", route: "/sales" },
    { name: "Cátalogo", route: "/catalogue" },
  ];
  const optionsVendedor = [
    { name: "Ingresar pedido", route: "/orders/new" },
    { name: "Promociones", route: "/promotions" },
    { name: "Cátalogo", route: "/catalogue" },
  ];
  const optionsDespachador = [
    { name: "Cuentas y Accesos", route: "/accounts" },
  ];
  const optionsLibrador = [{ name: "Recuadro de tareas", route: "/taskbox" }];
  const optionsReceptor = [{ name: "Recuadro de tareas", route: "/taskbox" }];
  const optionsContador = [
    { name: "Articulos no facturables", route: "/contador" },
    { name: "Lista de Asistencia", route: "/asistencia" },
  ];

  let options: any = [];
  const role = localStorage.getItem("role");
  switch (role) {
    case "Supervisor":
      options = optionsSupervisor;
      break;
    case "Cajero":
      options = optionsCajero;
      break;
    case "Vendedor":
      options = optionsVendedor;
      break;
    case "Despachador":
      options = optionsDespachador;
      break;
    case "Librador":
      options = optionsLibrador;
      break;
    case "Receptor":
      options = optionsReceptor;
      break;
    case "Contador":
      options = optionsContador;
      break;
  }

  const redirectTo = (route: string) => () => navigate(route);
  const [nameSuc, setNameSuc] = useState("");
  const getSucursalName = () => {
    const sucurs: Number = Number(localStorage.getItem("sucursal"));
    var s = getSucursal(sucurs);
    s.then((response) => {
      setNameSuc(response.attributes.nombre);
    });
    return nameSuc;
  };
  return (
    <Stack spacing="3" w="80%" mx="auto" my="5">
      <Text fontWeight="bold" textAlign="end">
          {" "}
          SUCURSAL:{" "}
          <Badge ml="1" fontSize="1.2em" colorScheme="red">
            {getSucursalName()}
          </Badge>
        </Text>
      <Flex flex="1" dir="row" alignItems="center" justifyContent="center">
        <Menu flex="1" maxW="80%">
          {options.map((o: any) => (
            <Option key={o.name} onClick={redirectTo(o.route)}>
              {o.name}
            </Option>
          ))}
          ;
        </Menu>
      </Flex>
    </Stack>
  );
};
