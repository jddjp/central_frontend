import { Flex } from '@chakra-ui/react';
import { Menu } from 'components/Menu';
import { Option } from 'components/Option';
import { useNavigate } from 'react-router-dom';

export const DashboardSeller = () => {
  const navigate = useNavigate();
  const options = [
    {name: 'Ingresar pedido', route: '/orders/new'},
    {name: 'Pedidos existentes', route: '/orders'},
    {name: 'Historial de venta', route: '/sales'},
    {name: 'Promociones', route: '/promotions'},
    {name: 'Cátalogo', route: '/catalogue'},
    // {name: 'Articulos', route: '/articulos'},
  ];

  const redirectTo = (route: string) => () => navigate(route);
  
  return (
    <Flex flex="1" dir="row" alignItems="center" justifyContent="center">
     <Menu flex="1" maxW="80%">
       {options.map(
         o => (
          <Option key={o.name} onClick={redirectTo(o.route)}>
           {o.name}
          </Option>)
       )};
     </Menu>
    </Flex>
  );
}