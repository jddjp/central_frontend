import { IconButton, IconButtonProps, HStack, StackProps, forwardRef } from '@chakra-ui/react';

import { InputField, InputFieldProps } from './InputField';

import { TiPlus as IncrementIcon, TiMinus as DecrementIcon } from 'react-icons/ti';

type IconButtonPropsWithoutArial = Omit<IconButtonProps, 'aria-label'> & {'aria-label'?: string};


export interface IncrementButtonProps extends IconButtonPropsWithoutArial { }

export const IncrementButton = forwardRef<IncrementButtonProps, "button">(
  (props, ref) => {

    return (
      <IconButton
        ref={ref}
        icon={<IncrementIcon />}
        colorScheme='brand'
        aria-label='Incremenetar'
        {...props}
      />
    )
  }
);

export interface DecrementButtonProps extends IconButtonPropsWithoutArial { }

export const DecrementButton = forwardRef<DecrementButtonProps, 'button'>(
  (props, ref) => {
    return (
      <IconButton
        ref={ref}
        icon={<DecrementIcon />}
        variant='outline'
        colorScheme='brand'
        aria-label='Decrementar'
        {...props}/>
    );
  }
);

export interface InputCounterProps extends InputFieldProps { }

export const InputCounter = forwardRef<InputCounterProps, 'input'>(
  (props, ref) => {
    return (
      <InputField
        ref={ref}
        type='number'
        textAlign='center'
        colorScheme="brand"
        {...props}
      />
    );
  }
);

export interface CounterProps extends StackProps {
  children: JSX.Element[],
}

export const Counter = (props: CounterProps) => {
  const {children, ...rest } = props;
  
  return (
    <HStack {...rest}>
      {children}
    </HStack>
  );
};