import { VStack, StackProps } from '@chakra-ui/react';

export interface MenuProps extends StackProps { }

export const Menu = (props: MenuProps) => {
    const { children, ...stackProps } = props;
    
    return (
        <VStack gap={25} p={5} data-test='menu' { ...stackProps }>
            { children }
        </VStack>
    );
}