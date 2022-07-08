import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SimpleGrid } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import styles from "./DataTableTicket.css";
import { Button } from "primereact/button";

type Nota = {
  src: string;
};

export const Nota = ({ items }, props: Nota) => {
  const columns = [
    { field: "article.attributes.nombre", header: "Producto" },
    { field: "article.attributes.precio_lista", header: "Precio" },
  ];
  const [products, setProducts] = useState(items.cart.items);
  const [client, setClient] = useState(items.client);
  console.log("client---");
  console.log(client);
  

  function calculateTotal(products: any) {
    let total = 0;
    products.forEach((product) => {
      total += (product.article.attributes.precio_lista * product.amount);
    });
    return total;
  }

  const dynamicColumns = columns.map((col, i) => {
    if (col.field == "article.attributes.nombre") {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          headerStyle={{ width: "4%", textColor: "blue" }}
          body={(data, props) => (
            <div>
              {" "}
              {products[props.rowIndex].article.attributes.nombre}{" "}
              {products[props.rowIndex].amount} x $
              {products[props.rowIndex].article.attributes.precio_lista}
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
  console.log(".....");
  console.log(products);

  return (
    <>
      <div style={{ padding: "15px" }}>
        <p style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>
          Comercializadora
        </p>
        <p>{date}</p>
        <SimpleGrid columns={2} spacing={10}>
          <Box height="40px">Cliente:{client.attributes.nombre + " " + client.attributes.apellido_paterno + " " + client.attributes.apellido_materno}</Box>
          <Box height="40px">Vendedor:</Box>
        </SimpleGrid>
        <div>
          <DataTable
            value={products}
            responsiveLayout="scroll"
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
          >
            {dynamicColumns}
          </DataTable>

          <SimpleGrid columns={2} spacing={2} style={{ "padding-top": "15px" }}>
            
            <Box height="30px">Total:</Box>
            <Box height="30px" style={{ width: "100%", textAlign: "right" }}>
              ${calculateTotal(products)}
            </Box>
          </SimpleGrid>
        </div>
      </div>
    </>
  );
};
