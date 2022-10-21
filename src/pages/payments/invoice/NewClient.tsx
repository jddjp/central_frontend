import React from 'react';
import { Stack, useToast } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios';
import * as yup from 'yup';

import { SERVER_ERROR_MESSAGE } from 'services/api/errors';
import { newCliente } from '../../../services/api/cliente';
import { RegisterOfElectrictFactura } from 'pages/orders/CreateOrderPage/FacturaModal';

const validateSchema = yup.object({
  RFC: yup
    .string()
    .required('El RFC es requerido')
    .min(13, 'El RFC debe tener mínimo 13 caracteres')
    .max(13, 'El RFC debe tener máximo 13 caracteres'),
  nombre: yup.string().required('El nombre es requerido'),
  apellido_paterno: yup.string().required('El Apellido Paterno es requerido'),
  apellido_materno: yup.string().required('El Apellido Materno es requerido'),
  calle: yup.string().required('La Calle es requerida'),
  colonia: yup.string().required('La Colonia es requerida'),
  correo: yup
    .string()
    .required('El correo es requerido')
    .email('El correo no es válido'),
});

const initialValues = {
  RFC: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  calle: '',
  colonia: '',
  correo: '',
  codigo_postal:'',
  telefono:'',
  ciudad: '',
  estado:'',
  id: 0
};

export default function NewClient() {
  const navigate = useNavigate()
  const toast = useToast();
  return (
    <Stack
      // spacing="3"
      w="100%"
      p='20'
      // mx="auto"
      // my="5"
      // justifyContent="center"
      // border='1px' borderColor='gray.200'
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validateSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          try {
            /* const client: any =  */ await newCliente(values);
            // console.log(client.data);
            toast({
              title: 'Cliente Registrado.',
              description: 'El cliente fue registrado correctamente.',
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            actions.resetForm();
            // todo: redireccionar a la pagina de tickets
          } catch (e) {
            const error = e as AxiosError;
            if (error?.response?.status === 400) {
              toast({
                title: 'Error.',
                description: 'No se pudo registrar el cliente.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            } else {
              toast({
                title: 'Error.',
                description: SERVER_ERROR_MESSAGE,
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            }
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        <Form>
          <RegisterOfElectrictFactura />
        </Form>
      </Formik>
    </Stack>
  );
}
