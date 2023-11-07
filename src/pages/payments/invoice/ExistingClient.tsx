import { useState, SetStateAction, Dispatch } from 'react';
import { Input, Stack, Text, useToast } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import { client, getClients } from 'services/api/cliente';
import { useQuery } from 'react-query';
import { autocompleteByReceptores } from 'services/api/users';
import { getBodegas, getSubsidiaries } from 'services/api/subsidiary';
import { Sucursal } from '../../../types/Stock';

export interface ClientInformationProps {
  setCliente?: Dispatch<SetStateAction<client | undefined>>
  setDistribution?: Dispatch<SetStateAction<any>>
  setOrigen?: Dispatch<SetStateAction<any>>
  distribution?: { bodega: number, sucursal: number, receptor: number }
  origen?: { bodega: number, sucursal: number, receptor: number }
  type?: boolean
}

const ExistingClient = (props : ClientInformationProps) => {
  const toast = useToast();
  const [user, setUser] = useState('');
  const { data: clients } = useQuery(["list-client"], getClients)
  const { data: receptors } = useQuery(["list-receptor"], autocompleteByReceptores)
  const { data: bodegas } = useQuery(["list-bodega"], getBodegas)
  const { data: subsidiaries } = useQuery(["list-subsidiary"], getSubsidiaries)
  const [textValue, setTextValue] = useState({
    name: "",
    firstName: "",
    lastName: ""
  });

  const handleChange = (option: SingleValue<any>) => {
    !option ? setUser('') : setUser(option.value)
    props.setCliente?.(option)
  };

  const handleNewClient = (e: any, target: string) => {
    setTextValue({...textValue, [target]: e.target.value})
    props.setCliente?.({
      attributes: {
        RFC: "",
        nombre: textValue.name,
        apellido_paterno: textValue.firstName,
        apellido_materno: textValue.lastName,
        calle: "",
        colonia: "",
        correo: "",
        codigo_postal: "",
        telefono: "",
        ciudad: "",
        estado: "",
        id: 0
      }
    });
  }

  const handleOrderDistribucion = (option: SingleValue<any>, target: string) => {
    //console.log(option)
    /*!option 
      ? props.setDistribution?.({...props.distribution, [target]: 0}) 
      : props.setDistribution?.({...props.distribution, [target]: option.id})*/


      /*if(props.distribution?.sucursal == props.origen?.sucursal){
        toast({
          title: 'Upps',
          description: 'Seleccionar una sucursusal diferente  a la de origen',
          status: 'warning',
          duration: 9000,
          isClosable: true,
        });
      }*/
      console.log(props.origen?.sucursal)
      console.log(props.distribution?.sucursal)
  }

  const handleOrigenDistribucion = (option: SingleValue<any>, target: string) => {
   // console.log(option)
    !option 
      ? props.setOrigen?.({...props.origen, [target]: 0}) 
      : props.setOrigen?.({...props.origen, [target]: option.id})

      console.log(props.origen)
  }
  //console.log(props.type)
  return (
    <Stack w="100%" mx="auto" mb="10" direction="column" spacing="4" mt='3'>
        
        
        <Text fontWeight='bold' fontSize={18}>{props.type ? 'Origen' : ''}</Text>
        
        { props.type ?
          <>
            <Select onChange={(e) => handleOrigenDistribucion(e, 'sucursal')} isClearable placeholder='Buscar sucursal'
              hideSelectedOptions
              key='distribution-sucursal'
              options={subsidiaries?.map((subsidiary: any) => {
                return {
                  id: subsidiary?.id,
                  label: `${subsidiary.attributes?.nombre}`
                }
            })}/> 
          </> : ''}
        <Text fontWeight='bold' fontSize={18}>{props.type ? 'Receptor' : 'Cliente'}</Text>

        { props.type ?
          <>
            <Select onChange={(e) => handleOrderDistribucion(e, 'receptor')} isClearable placeholder='Buscar receptor'
              key='distribution-receptor'
              hideSelectedOptions
              options={receptors?.map((receptor: any) => {
                return {
                  id: receptor?.id,
                  label: `${receptor?.nombre} ${receptor?.apellido_paterno} ${receptor?.apellido_materno}`
                }
            })}/>
            <Select onChange={(e) => handleOrderDistribucion(e, 'sucursal')} isClearable placeholder='Buscar sucursal'
              hideSelectedOptions
              key='distribution-sucursal'
              options={subsidiaries?.map((subsidiary: any) => {
                return {
                  id: subsidiary?.id,
                  label: `${subsidiary.attributes?.nombre}`
                }
            })}/> 
          </> :
          <>
            <Select onChange={handleChange} isClearable placeholder='Buscar cliente'
              isDisabled={textValue.name || textValue.firstName || textValue.lastName ? true : false}
              key='normal'
              hideSelectedOptions
              options={clients?.map((client: any) => {
                return {
                  id: client?.id,
                  label: `${client.attributes?.nombre} ${client.attributes?.apellido_paterno} ${client.attributes?.apellido_materno}`
                }
            })}/>

            <Stack spacing="5" direction='row'>
              <Input placeholder='Ingrese nombre' onChange={(e) => handleNewClient(e, 'name')} isDisabled={user ? true : false}/>
              <Input placeholder='Ingrese apellido paterno' onChange={(e) => handleNewClient(e, 'firstName')} isDisabled={user ? true : false}/>
              <Input placeholder='Ingrese apellido materno' onChange={(e) => handleNewClient(e, 'lastName')} isDisabled={user ? true : false}/>
            </Stack>
          </>
        }
    </Stack>
  );
}

export default ExistingClient
