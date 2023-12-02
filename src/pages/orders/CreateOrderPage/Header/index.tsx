import { HStack, StackProps } from "@chakra-ui/react";
import { SearchArticle, searchAriclesByStock } from "services/api/articles";
import { ShoppingCartArticle } from "../types";
import { ArticleSelect } from "./ArticleSelect";
import Select, { SingleValue } from "react-select";
import { useAuth } from "hooks/useAuth";
import { useQuery, useQueryClient } from "react-query";
import { getSubsidiaries } from "services/api/subsidiary";
import { useState } from "react";
export interface HeaderProps extends StackProps {
  onSelectArticle: (article: ShoppingCartArticle | null) => void;
  selectedArticle: ShoppingCartArticle | null;
  type?: boolean | undefined;
  origen?: { bodega: number; sucursal: number; receptor: number };
}

export const Header = (props: HeaderProps) => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [articulos , setArticulos] = useState(undefined)
  const { selectedArticle, onSelectArticle, type, origen, ...rest } = props;
  const handleSelectArticle = (article: SearchArticle | null) => {
    onSelectArticle(article);
  };
  const { data: subsidiaries } = useQuery(["list-sucursales"], getSubsidiaries);
  const handleOrigenDistribucion = async (
    option: SingleValue<any>,
    target: string
  ) => {

    if(option != null && option != undefined){
      //console.log(option.id)
      localStorage.setItem('sucursal', option.id)
      const resultA = await searchAriclesByStock(option.id)
      setArticulos(resultA)
      //console.log(resultA)
    }
    else{
      localStorage.setItem('sucursal', "0")
    }
    queryClient.invalidateQueries(["listaProductos"]);
  }
  return (
    <HStack {...rest}>

      {auth.user?.roleCons == "Supervisor"
       &&  <Select
        onChange={(e) => handleOrigenDistribucion(e, "sucursal")}
        isClearable={true}
        placeholder="Selecciona sucursal"
        hideSelectedOptions
        key="origen-sucursal"
        options={subsidiaries?.map((subsidiary: any) => {
          return {
            id: subsidiary?.id,
            label: `${subsidiary.attributes?.nombre}`
          };
        })}
      />
      }
      <ArticleSelect
        listA={articulos}
        type={props.type}
        article={selectedArticle}
        setArticle={handleSelectArticle}
        origen={props.origen}
      />
    </HStack>
  );
};

