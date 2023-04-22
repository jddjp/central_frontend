import { FC } from 'react';
import {
  FormControl as ChakraFormControl,
  FormControlProps as ChakraFormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  TextProps,
} from '@chakra-ui/react';
import { useField } from 'formik';

export interface FormControlProps extends ChakraFormControlProps {
  name: string;
  label?: string;
  labelProps?: FormLabelProps;
  helperText?: string;
  helperTextProps?: TextProps;
  errorMessageProps?: FormErrorMessageProps;
}

export const FormControl: FC<FormControlProps> = (props: FormControlProps) => {
  const {
    children,
    name,
    label,
    labelProps,
    helperText,
    helperTextProps,
    errorMessageProps,
    ...rest
  } = props;
  const [, { error, touched }] = useField(name);

  return (
    <ChakraFormControl isInvalid={!!error && touched} {...rest}>
      {label && (
        <FormLabel htmlFor={name} {...labelProps}>
          {label}
        </FormLabel>
      )}
      {children}
      {error && (
        <FormErrorMessage {...errorMessageProps}>{error}</FormErrorMessage>
      )}
      {helperText && (
        <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
      )}
    </ChakraFormControl>
  );
};