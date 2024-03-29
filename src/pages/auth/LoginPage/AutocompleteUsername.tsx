import { useState } from 'react';
import Select from 'react-select/async';
import { ActionMeta, components, InputActionMeta, MultiValue, SingleValue } from 'react-select';
import { asyncSelectAppStyles } from 'theme';
import { useRef } from 'react';
import { User } from 'types/User';
import { autocompleteByName } from 'services/api/users';
import { useMutation } from 'react-query';

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

export interface AutocompleteUsernameProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const getUserLabel = (user: User) => `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`;
const getUserValue = (user: User) => user.id.toString();

const AutocompleteUsername = (props: AutocompleteUsernameProps) => {
  // FIXED BUG: https://github.com/JedWatson/react-select/issues/4675
  const { user, setUser } = props;
  const [search, setInputValue] = useState('');
  const selectRef = useRef();
  const { mutateAsync } = useMutation(autocompleteByName)

  const handleInputChange = (newValue: string, { action }: InputActionMeta) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      setUser(null);
    }
  };

  const handleChange = (
    option: MultiValue<User> | SingleValue<User>,
    actionMeta: ActionMeta<User>
  ) => {
    setUser(option as User);
    setInputValue(option ? getUserLabel(option as User) : '');
  };

  const handleFocus = () => {
    user && (selectRef.current as any).select.inputRef.select();
  };

  return (
    <>
      <Select
        ref={selectRef as any}
        loadOptions={() => mutateAsync({search})}
        value={user}
        inputValue={search}
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
          'No se encontró ningún empleado con este nombre'
        }
        autoFocus
      />
    </>
  );
};

export { AutocompleteUsername }
