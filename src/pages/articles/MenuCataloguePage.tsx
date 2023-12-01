
import {  Flex, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Menu } from "components/Menu";
import { Option } from "components/Option";
export const MenuCataloguePage = () => {
  const navigate = useNavigate();
  const options = [
    { name: "Articulos", route: "/catalogue" },
    { name: "Clientes", route: "/menucatalogue/clientes" },
    { name: "Sucursales", route: "/promotions" },
    { name: "Usuarios", route: "/promotions" },
    { name: "Roles", route: "/promotions" },

  ];

  const redirectTo = (route: string) => () => navigate(route);
  return (
    <Stack spacing="3" w="80%" mx="auto" my="5">
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
  );};