import { Grid, GridProps } from "@chakra-ui/react";

export interface ArticleGridProps extends GridProps {}

export const ArticleGrid = (props: ArticleGridProps) => {
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      columnGap={{ base: "4", md: "6" }}
      rowGap={{ base: "8", md: "10" }}
      {...props}
    />
  );
};

