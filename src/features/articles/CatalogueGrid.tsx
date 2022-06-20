import { Grid, GridProps } from "@chakra-ui/react";

export const CatalogueGrid = (props: GridProps) => {
  return (
    <Grid
    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    gap="3"
      {...props}
    />
  );
};
