import { BoxProps, Box } from "@chakra-ui/react";


export interface CartBodyProps extends BoxProps { }

export const CartBody = (props: BoxProps) => (
  <Box
    boxShadow='base'
    p='6'
    rounded='md'
    flex='1'
    bg="gray.50"
    borderColor="brand.500"
    {...props}
  />
)