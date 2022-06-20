import React, { useState, useRef } from 'react';
import { Heading, HStack, Stack } from '@chakra-ui/react';
import { asyncSelectAppStyles } from 'theme';
import {
  ActionMeta,
  components,
  InputActionMeta,
  MultiValue,
  SingleValue,
} from 'react-select';
import Select from 'react-select/async';
import { autocompleteByCliente } from 'services/api/cliente';

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

const getUserLabel = (user: any) =>
  `${user.attributes.nombre} ${user.attributes.apellido_paterno} ${user.attributes.apellido_materno}`;

const getUserValue = (user: any) => user.id.toString();

const handleAutocomplete = async (search: string) => {
  if (search.length < 2) return [];

  return await autocompleteByCliente({ search });
};

export default function ExistingClient() {
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
  };

  const handleFocus = () => {
    user && (selectRef.current as any).select?.inputRef?.select();
  };

  return (
    <Stack
      spacing="3"
      alignItems="center"
      w="80%"
      mx="auto"
      my="5"
      justifyContent="center"
    >
      <Heading mt="10px" mb="15px">
        Buscar Cliente
      </Heading>
      <HStack
        spacing="3"
        alignItems="center"
        w="80%"
        mx="auto"
        my="5"
        justifyContent="center"
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
          placeholder="Ingresa tu nombre"
          loadingMessage={() => `Buscando...`}
          noOptionsMessage={() =>
            'No se encontro ningún empleado con este nombre'
          }
          autoFocus
        />
      </HStack>
    </Stack>
  );
}
