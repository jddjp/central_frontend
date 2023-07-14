import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image, SimpleGrid, StackProps, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
//import styles from "./DataTableTicket.css";
import { ShoppingCartItem } from "../types";
import { useAuth } from "hooks/useAuth";
export interface NotaProps extends StackProps {
  client: any
  items: any
}

export const Nota = ( props: NotaProps) => {
  const auth = useAuth();
  const columns = [
    { field: "article.attributes.nombre", header: "Descripcion" },
    { field: "article.amount", header: " " },
    { field: "article.attributes.precio_lista", header: "Precio" },
  ];
  console.log("items---");
  const [products, setProducts] = useState(props.items);
  //const [client, setClient] = useState<client | undefined>(props.client);
  console.log("client---");
  console.log(props);
  

  function calculateTotal(products: ShoppingCartItem[]) {
    let total = 0;
    products.forEach((product) => {
      total += (product.article.attributes.precio_lista * product.amount);
    });
    return total;
  }

  const dynamicColumns = columns.map((col, i) => {

    if (col.field == "article.amount") {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          headerStyle={{ width: "4%"}}
          body={(data, props) => (
            <div>
              {products[props.rowIndex].article.attributes.precio_lista} x {products[props.rowIndex].amount}
            </div>
          )}
        />
      );
    }

    if (col.field == "article.attributes.precio_lista") {
        return (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            headerStyle={{ width: "4%" }}
            body={(data, props) => (
              <div>
                ${products[props.rowIndex].amount * products[props.rowIndex].article.attributes.precio_lista}
              </div>
            )}
          />
        );
      }

    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        headerStyle={{ width: "4%" }}
      />
    );
  });

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()} ${current.getHours()}:${
    current.getMinutes() < 10
      ? "0" + current.getMinutes()
      : current.getMinutes()
  }`

  return (
    <Box p='1rem' >
      <Text display='block' fontWeight='bold' fontSize='20px' mb='1rem' textAlign='center'>Comercializadora "San Jose"</Text>
      <Text fontWeight='bold'>Central de abastos, puebla</Text>
      <Text as='cite' fontWeight='bold'>"El exito en la vida no se mide por lo que logras si no por los obstaculos que superas"</Text>
      <Text color='blackAlpha.600' my='0.5rem' fontWeight='bold'>{date}</Text>
      <Box my='0.5rem' display='flex' justifyContent='space-between' fontWeight='bold'>
        <Text height="40px">Cliente: {props.client?.label}</Text>
        <Text height="40px">Vendedor: {auth!.user!.nombre}</Text>
      </Box>

      <div>
        <DataTable
          value={products}
        >
          {dynamicColumns}
        </DataTable>
        <Text display='block' textAlign='end' mt='1rem' fontWeight='bold'>Total: {calculateTotal(products)}</Text>
        <Text display='block' textAlign='end' fontWeight='bold'>Articulos vendidos: {products.length}</Text>
        <Text display='block' textAlign='end' fontWeight='bold'>Gracias por su compra</Text>
      </div>
    </Box>
  );
};
