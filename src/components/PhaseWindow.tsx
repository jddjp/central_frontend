import { HStack, Spacer, Stack, StackProps, Box } from "@chakra-ui/react";
import { ArrowRightIcon, ArrowLeftIcon } from './icons';

export interface PhaseWindowProps extends Omit<StackProps, 'children'> {
  phase: number,
  canGoBack: boolean,
  canGoNext: boolean,
  children: React.ReactChild[],
  goBack: VoidFunction,
  goNext: VoidFunction,
}

export const PhaseWindow = (props: PhaseWindowProps) => {
  const { phase, canGoBack, canGoNext, children, goBack, goNext } = props;

  console.log({children, phase});
  return (
    <Stack>
      <HStack>
        {canGoBack && <ArrowLeftIcon onClick={goBack}/>}
        <Spacer />
        {canGoNext && <ArrowRightIcon onClick={goNext}/>}
      </HStack>

      <Box p="5">
        {children[phase]}
      </Box>
    </Stack>
  )
}