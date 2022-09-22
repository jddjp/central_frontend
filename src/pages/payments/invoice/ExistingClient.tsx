import React, { useState, useRef, Dispatch, SetStateAction } from 'react';
import { Heading, HStack, Stack,StackProps } from '@chakra-ui/react';
import { asyncSelectAppStyles } from 'theme';
import {
  ActionMeta,
  components,
  InputActionMeta,
  MultiValue,
  SingleValue,
} from 'react-select';
import Select from 'react-select/async';
import { autocompleteByCliente, client } from 'services/api/cliente';

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

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

export default function ExistingClient(props: ClientInformationProps) {
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const selectRef = useRef();

  const handleInputChange = (newValue: string, { action }: InputActionMeta) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      setUser(null);
      let cliente : client = {
        RFC: 'string',
        nombre: newValue,
        apellido_paterno: '',
        apellido_materno: '',
        calle: '',
        colonia: '',
        correo: '',
        codigo_postal: '',
        telefono: '',
        ciudad: '',
        estado: '',
      };
      props.setCliente(cliente);
      console.log("-----------------------------");
      console.log(cliente);
    }
  };

  const handleChange = (
    option: MultiValue<any> | SingleValue<any>,
    actionMeta: ActionMeta<any>
  ) => {
    setUser(option as any);
    setInputValue(option ? getUserLabel(option as any) : '');
    console.log(option.attributes);
    props.setCliente(option.attributes);
    
  };

  const handleFocus = () => {
    user && (selectRef.current as any).select?.inputRef?.select();
  };

  const handleClick = () => {
    
  }

  return (
    <Stack
      // spacing="3"
      // alignItems="center"
      w="100%"
      mx="auto"
      mb="10"
      // justifyContent="center"
    ><button type="submit" onClick={handleClick}>llll</button>
      {/* <Heading mt="10px" mb="15px">
        Buscar Cliente
      </Heading> */}
      <HStack
        // spacing="3"
        // alignItems="center"
        w="100%"
        mx="auto"
        // my="5"
        // justifyContent="center"
      >
        <Select
          ref={selectRef as any}
          loadOptions={handleAutocomplete}
          value={user}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleChange}
          onFocus={handleFocus}
          controlShouldRenderValue={false}
          components={{ Input: Input }}
          getOptionLabel={getUserLabel}
          getOptionValue={getUserValue}
          styles={asyncSelectAppStyles}
          hideSelectedOptions
          placeholder=""
          loadingMessage={() => `Buscando...`}
          noOptionsMessage={() =>
            'No se encontro ningún cliente con este nombre'
          }
          autoFocus
        />
      </HStack>
    </Stack>
  );
}
