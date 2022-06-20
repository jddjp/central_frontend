import { HStack, PinInput, PinInputField, StackProps, VStack, Heading } from "@chakra-ui/react";


export interface PasswordPhaseProps extends StackProps {
  name?: string,
  onFinish: (pin: string) => void,
}

export const PasswordPhase = (props: PasswordPhaseProps) => {
  const { name, onFinish, children, ...rest } = props;

  return (
    <VStack spacing='5' {...rest}>
      <Heading fontWeight='bold'>¡Hola {name}!</Heading>
      <Heading fontWeight="medium" as="h4" size="md">
        Ingresa tu contraseña de 6 dígitos
      </Heading>
      <HStack>
        <PinInput 
          mask
          autoFocus 
          onComplete={onFinish}
        >
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
    </VStack>
  );
}