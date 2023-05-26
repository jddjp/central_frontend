import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SimpleGrid, StackProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
//import styles from "./DataTableTicket.css";
import { ShoppingCartItem } from "../types";

export interface NotaProps extends StackProps {
  client: any
  items: any
}

export const Nota = ( props: NotaProps) => {
  const columns = [
    { field: "article.attributes.nombre", header: "Producto" },
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
    console.log("..............");
    console.log(col);
    
    
    if (col.field == "article.amount") {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          headerStyle={{ width: "4%", textColor: "blue" }}
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
            headerStyle={{ width: "4%", textColor: "blue" }}
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
        headerStyle={{ width: "4%", textColor: "blue" }}
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
  }`;
  console.log(".....-");
  console.log(products);
  console.log(props.client);

  return (
    <>
      <div style={{ padding: "15px" }}>
        <p style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>
          Comercializadora
        </p>
        <p>{date}</p>
        <SimpleGrid columns={2} spacing={10}>
          <Box height="40px">Cliente: {props.client?.label}</Box>
        </SimpleGrid>
        <div>
          <DataTable
            value={products}
            responsiveLayout="scroll"
          >
            {dynamicColumns}
          </DataTable>

          <SimpleGrid columns={2} spacing={2} >
            
            <Box height="30px" style={{paddingLeft: "15px"}}>Total:</Box>
            <Box height="30px;" style={{textAlign: "center"}}>
              ${calculateTotal(products)}
            </Box>
          </SimpleGrid>
        </div>
      </div>
    </>
  );
};
