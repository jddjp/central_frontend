import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export interface useInfiniteScrollConfig {
  wait?: number;
}

export const useInfiniteScroll = (onNext: VoidFunction) => {
  const { ref, inView } = useInView({ trackVisibility: true, delay: 1000 });

  useEffect(() => {
    if (inView) {
      onNext();
    }
  }, [inView, onNext]);

  return {
    ref,
  };
};
