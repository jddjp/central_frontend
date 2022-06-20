import * as React from 'react'
import { Field } from 'formik';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react'

import { FormControl, FormControlProps } from 'components/FormControl';
import { InputPropsWithRequiredName } from 'types/forms';
import { HideIcon, ShowIcon } from './icons';

export interface PasswordFieldProps extends InputPropsWithRequiredName {
  formControlProps: Omit<FormControlProps, "name">
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
  const { isOpen, onToggle } = useDisclosure()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const mergeRef = useMergeRefs(inputRef, ref)

  const onClickReveal = () => {
    onToggle()
    const input = inputRef.current
    if (input) {
      input.focus({ preventScroll: true })
      const length = input.value.length * 2
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length)
      })
    }
  }
  const { formControlProps, ...inputProps } = props;

  return (
    <FormControl name={inputProps.name!} {...formControlProps}>
      <InputGroup>
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <HideIcon /> : <ShowIcon />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Field
          ref={mergeRef}
          type={isOpen ? 'text' : 'password'}
          autoComplete="current-password"
          as={Input}
          {...inputProps}
        />
      </InputGroup>
    </FormControl>
  )
})