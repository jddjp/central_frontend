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
  searchArticlesByOrigen,
  searchArticlesBySucursal,
} from "services/api/articles";
import { ShoppingCartArticle } from "../types";
import { useAuth } from "hooks/useAuth";
import { useToast } from "@chakra-ui/react";

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

export interface ArticleSelectProps {
  article: ShoppingCartArticle | null;
  setArticle: (article: ShoppingCartArticle | null) => void;
  type?: boolean;
  origen?: { bodega: number; sucursal: number; receptor: number };
}



const handleAutocomplete = async (search: string, type: boolean, articles: { descripcion: string; }[]) => {
  if (!type) {
    const result = await searchArticles(search);
    return result.data;
  } else {

    return articles
  }

};

export const ArticleSelect = (props: ArticleSelectProps) => {
  const toast = useToast();
  // FIXED BUG: https://github.com/JedWatson/react-select/issues/4675
  const { article, setArticle, type, origen } = props;
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

  const getArticles = async (search: string, type: boolean) => {
    if (!type) {
      const result = await searchArticles(search);
      return result.data;
    } else {
      var articles :any []= []
      if(origen?.sucursal == 0){
        toast({
          title: "Upsss",
          description:
            "Selecciona una sucursal de origen",
          status: "error",
          duration: 400,
          isClosable: true,
        });
        return
      }
      var sucursal = origen?.sucursal
      const result = await searchArticlesByOrigen(sucursal!.toString());
      result.data.forEach((stock:any) => {
        articles.push(stock.attributes.articulo.data)
      });
      return articles;
    }

  };

  const getArticleLabel = (article: ShoppingCartArticle) => {
    return article.attributes.nombre;
  }
  const handleAutocomplete = async (search: string) => {
    // if (search.length < 3) return [];
    const result = await searchArticles(search);
    // console.log("===========Productos============");
    // console.log(result.data);
    return result.data;
  };

  const getArticleValue = (article: ShoppingCartArticle) => { return article.id.toString(); }
  return (
    <>
      { !type &&
      <Select
      defaultOptions
      loadOptions={handleAutocomplete}
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
      noOptionsMessage={() => 'No hay opciones disponibles'}
    />}
      { type && <Select
        loadOptions={auth.user?.roleCons !== 'Supervisor' ? () => searchArticlesBySucursal(inputValue, Number(sucursal)) : () => getArticles(inputValue, type ? true : false)}
        value={article}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        controlShouldRenderValue={false}
        components={{ Input: Input }}
        getOptionLabel={getArticleLabel}
        getOptionValue={getArticleValue}
        styles={asyncSelectAppStyles}
        //hideSelectedOptions
        placeholder="Buscar artículo"
        loadingMessage={() => `Buscando...`}
        noOptionsMessage={() => "No hay opciones disponibles"}
  />}
    </>
  );
};
