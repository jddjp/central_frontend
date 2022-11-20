import React, { useState, useRef, useImperativeHandle, Dispatch, SetStateAction } from 'react';
import { Stack,StackProps, Input } from '@chakra-ui/react';
import { asyncSelectAppStyles } from 'theme';
import {
  ActionMeta,
  components,
  InputActionMeta,
  MultiValue,
  SingleValue,
} from 'react-select';
import Select from 'react-select/async';
import { autocompleteByCliente, client, Cliente } from 'services/api/cliente';
import { forwardRef } from "react";


const InputSelect = (props: any) => <components.Input {...props} isHidden={false} />;

const getUserLabel = (user: any) =>
  `${user.attributes.nombre} ${user.attributes.apellido_paterno} ${user.attributes.apellido_materno}`;

const getUserValue = (user: any) => user.id.toString();

const handleAutocomplete = async (search: string) => {
  if (search.length < 1) return [];

  return await autocompleteByCliente({ search });
};

export interface ClientInformationProps extends StackProps {
  //onFinishUser: (client: client) => void
  setCliente: Dispatch<SetStateAction<client | undefined>>
}

//export default function ExistingClient(props: ClientInformationProps) {
export const ExistingClient = forwardRef((props : ClientInformationProps, ref) => {

  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [textValue, setTextValue] = useState({
    name: "",
    firstName: "",
    lastName: ""
  });
  const selectRef = useRef();

  const handleInputChange = (newValue: string, { action }: InputActionMeta) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      setUser(null);
    }
  };

  const handleChange = (
    option: MultiValue<any> | SingleValue<any>,
    actionMeta: ActionMeta<any>
  ) => {
    setUser(option as any);
    setInputValue(option ? getUserLabel(option as any) : '');
    console.log(option);
    props.setCliente(option);
    
  };

  const handleNewClient = (e: any, target: string) => {
    setTextValue({...textValue, [target]: e.target.value})
    props.setCliente({
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

  const handleFocus = () => {
    user && (selectRef.current as any).select?.inputRef?.select();
  };

  const handleClick2 = (cli: Cliente) => {

    setUser(cli as any);
    setInputValue(cli ? getUserLabel(cli as any) : '');
  }

  useImperativeHandle(ref, () => {
    return {
      handleClick2
    }
  })

  return (
    <Stack
      w="100%"
      mx="auto"
      mb="10"
      direction="column"
      spacing="4"
      mt='3'>
        <Select
          ref={selectRef as any}
          loadOptions={handleAutocomplete}
          value={user}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleChange}
          onFocus={handleFocus}
          controlShouldRenderValue={false}
          components={{ Input: InputSelect }}
          getOptionLabel={getUserLabel}
          getOptionValue={getUserValue}
          styles={asyncSelectAppStyles}
          isDisabled={textValue.name || textValue.firstName || textValue.lastName ? true : false}
          hideSelectedOptions
          placeholder="Buscar cliente"
          loadingMessage={() => `Buscando...`}
          noOptionsMessage={() =>
            'No se encontro ningún cliente con este nombre'
          }
          autoFocus
        />
        {/* <Box display="flex"> */}
          <Stack spacing="5" direction='row'>
            <Input placeholder='Ingrese nombre' onChange={(e) => handleNewClient(e, 'name')} isDisabled={inputValue ? true : false}/>
            <Input placeholder='Ingrese apellido paterno' onChange={(e) => handleNewClient(e, 'firstName')} isDisabled={inputValue ? true : false}/>
            <Input placeholder='Ingrese apellido materno' onChange={(e) => handleNewClient(e, 'lastName')} isDisabled={inputValue ? true : false}/>
          </Stack>
        {/* </Box> */}
    </Stack>
  );
//}
});
