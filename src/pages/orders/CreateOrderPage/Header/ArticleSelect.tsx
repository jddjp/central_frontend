import { useEffect, useState } from "react";
import Select from "react-select/async";
import {
  components,
  InputActionMeta,
  MultiValue,
  SingleValue,
} from "react-select";
import { asyncSelectAppStyles } from "theme";
import {
  searchArticles,
  searchArticlesBySucursal,
} from "services/api/articles";
import { ShoppingCartArticle } from "../types";
import { useAuth } from "hooks/useAuth";

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

export interface ArticleSelectProps {
  article: ShoppingCartArticle | null;
  setArticle: (article: ShoppingCartArticle | null) => void;
  type?: boolean;
}

const getArticleLabel = (article: ShoppingCartArticle) =>
  article.attributes.nombre;

const getArticleValue = (article: ShoppingCartArticle) => article.id.toString();

const handleAutocomplete = async (search: string, type: boolean) => {
  if (!type) {
    const result = await searchArticles(search);
    return result.data;
  } else {
    return [];
  }
};

export const ArticleSelect = (props: ArticleSelectProps) => {
  // FIXED BUG: https://github.com/JedWatson/react-select/issues/4675
  const { article, setArticle, type } = props;
  const [inputValue, setInputValue] = useState("");
  const auth = useAuth();
  const sucursal = localStorage.getItem("sucursal");
  useEffect(() => {
    article?.id === null && setInputValue("");
  }, [article?.id]);

  const handleInputChange = (newValue: string, { action }: InputActionMeta) => {
    if (action === "input-change") {
      setInputValue(newValue);
      setArticle(null);
    }
  };

  const handleChange = (
    option: MultiValue<ShoppingCartArticle> | SingleValue<ShoppingCartArticle>
  ) => {
    setArticle(option as ShoppingCartArticle);
    setInputValue(
      option ? (option as ShoppingCartArticle).attributes.nombre : ""
    );
    setInputValue("");
  };

  return (
    <>
      <Select
        defaultOptions
        loadOptions={
          auth.user?.roleCons !== "Supervisor"
            ? () =>
                searchArticlesBySucursal(
                  inputValue,
                  type ? Number(sucursal) : 0
                )
            : () => handleAutocomplete(inputValue, type ? true : false)
        }
        value={article}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        controlShouldRenderValue={false}
        components={{ Input: Input }}
        getOptionLabel={getArticleLabel}
        getOptionValue={getArticleValue}
        styles={asyncSelectAppStyles}
        hideSelectedOptions
        placeholder="Buscar artículo"
        loadingMessage={() => `Buscando...`}
        noOptionsMessage={() => "No hay opciones disponibles"}
      />
    </>
  );
};
