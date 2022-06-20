import { Box } from "@chakra-ui/react";
import { useInfiniteScroll } from "hooks/useInfiniteScroll";

export interface InfiniteScrollContainerProps {
  onNext: VoidFunction;
  children: React.ReactNode;
}

export const InfiniteScrollContainer = (
  props: InfiniteScrollContainerProps
) => {
  const { onNext, children } = props;
  const { ref } = useInfiniteScroll(onNext);

  return (
    <>
      {children}
      <Box ref={ref} />
    </>
  );
};
