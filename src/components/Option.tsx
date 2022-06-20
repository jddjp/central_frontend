import { Button, ButtonProps } from '@chakra-ui/react';

export interface OptionProps extends ButtonProps { }

export const Option = (props: OptionProps) => {
    return (
        <Button
            colorScheme="brand"
            w="full"
            data-test='option'
            { ...props }
        />
    );
}