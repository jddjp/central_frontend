import * as React from 'react';
import { Field } from 'formik';
import { Input } from '@chakra-ui/react';

import { FormControl, FormControlProps } from 'components/FormControl';
import { InputPropsWithRequiredName } from 'types/forms';

export interface InputFieldProps extends InputPropsWithRequiredName {
  formControlProps?: Omit<FormControlProps, 'name'>;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (props, ref) => {
    const { formControlProps = {}, ...inputProps } = props;
    return (
      <FormControl name={inputProps.name!} {...formControlProps}>
        <Field ref={ref} as={Input} {...inputProps} />
      </FormControl>
    );
  }
);
