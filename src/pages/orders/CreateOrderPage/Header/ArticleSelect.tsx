import { useEffect, useState } from 'react';
import Select from 'react-select/async';
import {
  ActionMeta,
  components,
  InputActionMeta,
  MultiValue,
  SingleValue,
} from 'react-select';
import { asyncSelectAppStyles } from 'theme';
import { searchArticles } from 'services/api/articles';
import { ShoppingCartArticle } from '../types';

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

export interface ArticleSelectProps {
  article: ShoppingCartArticle | null;
  setArticle: (article: ShoppingCartArticle | null) => void;
}

const getArticleLabel = (article: ShoppingCartArticle) =>
  article.attributes.nombre;

const getArticleValue = (article: ShoppingCartArticle) => article.id.toString();

const handleAutocomplete = async (search: string) => {
  if (search.length < 3) return [];

  const result = await searchArticles(search);
  return result.data;
};

export const ArticleSelect = (props: ArticleSelectProps) => {
  // FIXED BUG: https://github.com/JedWatson/react-select/issues/4675
  const { article, setArticle } = props;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    article?.id === null && setInputValue('');
  }, [article?.id]);

  const handleInputChange = (newValue: string, { action }: InputActionMeta) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      setArticle(null);
    }
  };

  const handleChange = (
    option: MultiValue<ShoppingCartArticle> | SingleValue<ShoppingCartArticle>,
    actionMeta: ActionMeta<ShoppingCartArticle>
  ) => {
    setArticle(option as ShoppingCartArticle);
    setInputValue(
      option ? (option as ShoppingCartArticle).attributes.nombre : ''
    );
  };

  return (
    <>
      <Select
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
      />
    </>
  );
};
