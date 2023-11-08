import { HStack, StackProps } from "@chakra-ui/react";
import { SearchArticle } from "services/api/articles";
import { ShoppingCartArticle } from "../types";
import { ArticleSelect } from "./ArticleSelect";

export interface HeaderProps extends StackProps {
  onSelectArticle: (article: ShoppingCartArticle | null) => void;
  selectedArticle: ShoppingCartArticle | null;
  type?: boolean | undefined;
}

export const Header = (props: HeaderProps) => {
  //props.setType = false
  const { selectedArticle, onSelectArticle, type, ...rest } = props;

  const handleSelectArticle = (article: SearchArticle | null) => {
    onSelectArticle(article);
  };

  return (
    <HStack {...rest}>
      <ArticleSelect
        type={props.type}
        article={selectedArticle}
        setArticle={handleSelectArticle}
      />
    </HStack>
  );
};

