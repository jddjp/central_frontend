import { Stack, StackProps } from '@chakra-ui/react';

export interface FixedMenuProps extends StackProps { }

export const FixedMenu = (props: FixedMenuProps) => {
  return <Stack spacing='3' right='3' top='30vh' position='fixed' zIndex='100' {...props} />
}