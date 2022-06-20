import { Flex } from '@chakra-ui/react';

interface CenterLayoutProps {
    children: React.ReactNode
}

export const CenterLayout = (props: CenterLayoutProps) => {
    const { children } = props;
    
    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            {children}
        </Flex>
    );
}