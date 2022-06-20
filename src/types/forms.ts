import { InputProps } from "@chakra-ui/react";

export type InputPropsWithRequiredName = Omit<InputProps, "name"> & {name: string};
