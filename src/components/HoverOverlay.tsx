import { Box, BoxProps } from "@chakra-ui/react";

export interface HoverOverlayProps {
  wrapperProps: BoxProps;
  children: React.ReactNode;
  overlayBackground?: string;
  overlayIcon?: React.ReactNode;
}

const Overlay = (props: BoxProps) => {
  return <Box w="full" bg="gray.100" {...props}></Box>;
};

export const HoverOverlay = (props: HoverOverlayProps) => {
  const { children, wrapperProps, overlayBackground, overlayIcon } = props;

  return (
    <Box position="relative" {...wrapperProps}>
      <Box zIndex={2} _hover={{ zIndex: 0 }} {...wrapperProps}>
        {children}
      </Box>
      <Overlay zIndex={1} bg={overlayBackground}>
        {overlayIcon}
      </Overlay>
    </Box>
  );
};
