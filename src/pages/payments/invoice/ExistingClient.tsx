import React, { useState, useRef, useImperativeHandle, Dispatch, SetStateAction } from 'react';
import { HStack, Stack,StackProps } from '@chakra-ui/react';
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

//export default function ExistingClient(props: ClientInformationProps) {
  export const ExistingClient = forwardRef((props : ClientInformationProps, ref) => {
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
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
      mt='3'>
      <HStack
        w="100%"
        mx="auto">
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
          placeholder="Buscar cliente"
          loadingMessage={() => `Buscando...`}
          noOptionsMessage={() =>
            'No se encontro ningún cliente con este nombre'
          }
          autoFocus
        />
      </HStack>
    </Stack>
  );
//}
});
