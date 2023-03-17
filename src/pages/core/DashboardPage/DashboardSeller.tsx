import { Flex } from '@chakra-ui/react';
import { Menu } from 'components/Menu';
import { Option } from 'components/Option';
import { useNavigate } from 'react-router-dom';

export const DashboardSeller = () => {
  const navigate = useNavigate();

  const optionsSupervisor = [
    {name: 'Ingresar pedido', route: '/orders/new'},
    {name: 'Pedidos existentes', route: '/orders'},
    {name: 'Historial de venta', route: '/sales'},
    {name: 'Promociones', route: '/promotions'},
    {name: 'Cátalogo', route: '/catalogue'},
    // {name: 'Articulos', route: '/articulos'},
  ];
  const optionsCajero = [
    {name: 'Ingresar pedido', route: '/orders/new'},
    {name: 'Pedidos existentes', route: '/orders'},
    {name: 'Historial de venta', route: '/sales'},
  ];
  const optionsVendedor = [
    {name: 'Ingresar pedido', route: '/orders/new'},
    {name: 'Promociones', route: '/promotions'},
    {name: 'Cátalogo', route: '/catalogue'},

  ];
  const optionsDespachador = [
    {name: 'Cuentas y Accesos', route: '/accounts'},
  ];
  const optionsLibrador = [
    {name: 'Recuadro de tareas', route: '/taskbox'}
  ];
  const optionsReceptor = [
    {name: 'Recuadro de tareas', route: '/taskbox'}
  ];
  const optionsContador = [
    {name: 'Historial de venta', route: '/sales'},
  ];
  
  let options: any = [];
  const role = localStorage.getItem('role');
  switch(role){
    case 'Supervisor': options = optionsSupervisor;
      break;
    case 'Cajero': options = optionsCajero;
      break;
    case 'Vendedor': options = optionsVendedor;
      break;
    case 'Despachador': options = optionsDespachador;
      break;
    case 'Librador': options = optionsLibrador;
      break;
    case 'Receptor': options = optionsReceptor;
      break;
    case 'Contador': options = optionsContador;
      break;
  }

  const redirectTo = (route: string) => () => navigate(route);
  
  return (
    <Flex flex="1" dir="row" alignItems="center" justifyContent="center">
     <Menu flex="1" maxW="80%">
       {options.map(
         (o:any) => (
          <Option key={o.name} onClick={redirectTo(o.route)}>
           {o.name}
          </Option>)
       )};
     </Menu>
    </Flex>
  );
}