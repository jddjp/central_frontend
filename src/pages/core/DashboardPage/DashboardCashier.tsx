import { Option } from 'components/Option';
import { Menu, MenuProps } from 'components/Menu';
import { useNavigate } from 'react-router-dom';

export const CheckerMenuUI = (props: MenuProps) => {   
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route); 

  return (
    <Menu {...props}>
      <Option onClick={redirectTo('/')}>
          Ingresar Pedido
      </Option>
      <Option onClick={redirectTo('/')}>
          Pedido Existente
      </Option>
      <Option onClick={redirectTo('/')}>
          Historial de ventas
      </Option>
      <Option onClick={redirectTo('/')}>
          Mostrar promociones
      </Option>
      <Option onClick={redirectTo('/')}>
          Mostrar catálogo
      </Option>
    </Menu>
  )
};