import { Button, Heading, Input, Stack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';

import { Menu } from 'components/Menu';
import { Option } from 'components/Option';
import { InputField } from 'components/InputField';

export const SearchClientStage = () => {
  return (
    <>
      <Input placeholder="Ingresa nombre de cliente" />
      <Button>Ingresar</Button>
    </>
  );
};

export const RegisterOfElectrictFactura = () => {
  const { isSubmitting } = useFormikContext();
  // Revisar:
  // Ticket (senalar en rojo aquellos productso sin poder facturar)
  // Factura
  // Finalizar
  return (
    <Stack
    w="100%"
    // border='1px' borderColor='gray.200'
    >
      
      <InputField
        name="RFC"
        placeholder="Ingresa RFC"
        formControlProps={{
          label: 'RFC',
          isRequired: true,
        }}
      />
      <InputField
        name="nombre"
        placeholder="Ingresa nombre"
        formControlProps={{ label: 'Nombre', isRequired: true }}
      />
      <InputField
        name="apellido_paterno"
        placeholder="Ingresa apellido paterno"
        formControlProps={{ label: 'Apellido Paterno', isRequired: true }}
      />
      <InputField
        name="apellido_materno"
        placeholder="Ingresa apellido materno"
        formControlProps={{ label: 'Apellido Materno', isRequired: true }}
      />
      <InputField
        name="calle"
        placeholder="Ingresa calle"
        formControlProps={{ label: 'Calle', isRequired: true }}
      />
      <InputField
        name="colonia"
        placeholder="Ingresa colonia"
        formControlProps={{ label: 'Colonia', isRequired: true }}
      />
      <InputField
        name="correo"
        placeholder="Ingresa correo electrónico"
        formControlProps={{ label: 'E-mail', isRequired: true }}
      />
      <InputField
      type="number"
        name="codigo_postal"
        placeholder="Ingresa codigo postal"
        formControlProps={{ label: 'Codigo postal', isRequired: true }}
      />
      <InputField
      type="number"
        name="telefono"
        placeholder="Ingresa telefono"
        formControlProps={{ label: 'Telefono', isRequired: true }}
      />
      <InputField
        name="ciudad"
        placeholder="Ingresa Ciudad"
        formControlProps={{ label: 'Ciudad', isRequired: true }}
      />
      <InputField
        name="estado"
        placeholder="Ingresa Estado"
        formControlProps={{ label: 'Estado', isRequired: true }}
      />
      <Button type="submit" disabled={isSubmitting}>
        Registrar
      </Button>
    </Stack>
  );
};

export const FacturaModal = () => {
  // const { value, increment, decrement } = useCounter();
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route);

  return (
    <>
      <Heading fontWeight="bold">Pago realizado con éxito!</Heading>
      <Heading fontWeight="light">Se requiere de:</Heading>

      <Menu w="80%">
        <Option onClick={redirectTo('/orders/typeInvoice')}>Factura</Option>
        <Option onClick={() => console.log('hola')}>Nota simple</Option>
      </Menu>
    </>
  );
};

export const TypeInvoice = () => {
  const navigate = useNavigate();
  const redirectTo = (route: string) => () => navigate(route);
  return (
    <>
      <Heading fontWeight="bold">Factura</Heading>

      <Menu w="80%">
        <Option onClick={redirectTo('/orders/typeInvoice/ExistingClient')}>
          Cliente existente
        </Option>
        <Option onClick={redirectTo('/orders/typeInvoice/newCliente')}>
          Registrar Nuevo Cliente
        </Option>
      </Menu>
    </>
  );
};
