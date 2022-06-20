import { Box } from "@chakra-ui/react";
import { useCatalogue } from "./useCatalogue";
import { CatalogueGrid } from "features/articles/CatalogueGrid";
import { CatalogueArticle } from "features/articles/CatalogueArticle";

const CataloguePage = () => {
  const { articles, ref, status } = useCatalogue();

  return (
    <CatalogueGrid p="5" w="full">
      {articles.map((article, index) => (
        <CatalogueArticle key={article.id} article={article} />
      ))}
      {status !== "success" && <Box>Cargando...</Box>}
      <Box ref={ref} />
    </CatalogueGrid>
  );
};

export default CataloguePage;
