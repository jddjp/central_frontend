import { IconButtonProps, Tooltip, IconButton } from "@chakra-ui/react";

export interface IconActionProps extends IconButtonProps { }

export const IconAction = (props: IconActionProps) => {
  return (
    <Tooltip label={props["aria-label"]}>
      <IconButton
        fontSize='20px'
        {...props}
      />
    </Tooltip>
  );
}