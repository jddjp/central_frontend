import { HStack, StackProps } from "@chakra-ui/react";
import { SearchArticle } from "services/api/articles";
import { ShoppingCartArticle } from "../types";
import { ArticleSelect } from "./ArticleSelect";

export interface HeaderProps extends StackProps {
  onSelectArticle: (article: ShoppingCartArticle | null) => void;
  selectedArticle: ShoppingCartArticle | null;
  type?: boolean | undefined;
  origen?: { bodega: number; sucursal: number; receptor: number };
}

export const Header = (props: HeaderProps) => {
  const { selectedArticle, onSelectArticle, type, origen, ...rest } = props;
  const handleSelectArticle = (article: SearchArticle | null) => {
    onSelectArticle(article);
  };

  return (
    <HStack {...rest}>
      <ArticleSelect
        type={props.type}
        article={selectedArticle}
        setArticle={handleSelectArticle}
        origen={props.origen}
      />
    </HStack>
  );
};

