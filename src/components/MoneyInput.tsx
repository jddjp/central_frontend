import { Input, InputGroup, InputLeftElement, InputProps } from '@chakra-ui/react';

export interface MoneyInputProps extends InputProps { }

export const MoneyInput = (props: InputProps) => {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents='none'
        color='gray.300'
        fontSize='1.2em'
        children='$'
      />
      <Input placeholder='Ingresa la cantidad...' { ...props } />
    </InputGroup>
  );
}