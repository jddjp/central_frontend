import { Box } from "@chakra-ui/react";
import { useCatalogue } from "./useCatalogue";
import { CatalogueGrid } from "features/articles/CatalogueGrid";
import { CatalogueArticle } from "features/articles/CatalogueArticle";

import React, { useState, useEffect } from 'react'
import { appAxios, baseMediaUrl } from 'config/api';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
export const Productos = () => {
const [sales, setSales] = useState([])
const [productos, setProduct] = useState([])
const [productDialog, setProductDialog] = useState(false);
const [deleteProductDialog, setDeleteProductDialog] = useState(false);
const [globalFilterValue1, setGlobalFilterValue1] = useState('');
const [submitted, setSubmitted] = useState(false);
let produc = {
  nombre: '',
  marca: ''
}
useEffect(() => {
  appAxios.get(`/articulos?populate=foto`).then((response: { data: any; }) => {
    const data = response.data
    setSales(data.data)
  })


}, []);
const ped = sales.map((data: any) => {
  return data.attributes
})
// const pro = ped.map((data: any) => {
//   produc = {
//     nombre: data.nombre,
//     marca: data.marca
//   }

// })


const onGlobalFilterChange1 = (e: any) => {
  const value = e.target.value;
  setGlobalFilterValue1(value);
}
const filters = {

  'nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
}
const openNew = () => {
  setProduct(produc);
  setSubmitted(false);
  setProductDialog(true);
}
const renderHeader1 = () => {
  return (
    <div className="flex justify-content-between">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} />
        <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
      </span>
    </div>
  )
}

const header = renderHeader1();



const editProduct = (data: any) => {
  setProduct({ ...data });
  
  console.log(data);
  
  setProductDialog(true);
}
const onInputChange = (e: any, name: any) => {
  const val = (e.target && e.target.value) || '';
  let _product = { ...produc };
  _product[`${name}`] = val;
  console.log('input', val, name, _product);

  // setProduct(_product);
}
const confirmDeleteProduct = (product: any) => {
  setProduct(product);
  setDeleteProductDialog(true);
}
const hideDeleteProductDialog = () => {
  setDeleteProductDialog(false);
}
const hideDialog = () => {
  setSubmitted(false);
  setProductDialog(false);
}
const deleteProduct = () => {
  console.log('dgnnvfgdgdle');

}
const deleteProductDialogFooter = (
  <React.Fragment>
    <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
    <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
  </React.Fragment>
);
console.log(ped.nombre);

return (
  <>
    <div className="card container">
      <DataTable value={ped} paginator className="p-datatable-customers" showGridlines rows={10} header={header} filters={filters} editMode="row">
        <Column field="nombre" header="Nombre" />
        <Column field="precio_lista" header="Presio" />
        <Column field="marca" header="Marca" />
        <Column field="inventario_fiscal" header="inventario_fiscal" style={{ width: "5%" }} />
        <Column field="inventario_fisico" header="Inventario fisico" style={{ width: "5%" }} />
        <Column field="descripcion" header="Dsscripcion" style={{ width: "20%" }} />
        <Column field="categoria" header="Categoria" />
        <Column field="codigo_barras" header="Cod. Barra" />
        <Column field="codigo_qr" header="Cod. Qr" />
        <Column field="estado" header="EStado" />
        <Column header="Foto" body={(data: any) => {
          return <img src={baseMediaUrl + data.foto.data.attributes.url} alt="producto" width="25" />
        }} />
        <Column body={(data: any) => {
          return <div>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(data)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(data)} />
          </div>
        }} exportable={false} style={{ minWidth: '8rem' }} />
      </DataTable>
    </div>




    <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" onHide={hideDialog}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <InputText id="name" value={productos.nombre} onChange={(e: any) => onInputChange(e, 'nombre')} required autoFocus />
        {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
      </div>
      <div className="field">
        <label htmlFor="name">Name</label>
        <InputText id="name" value={productos.marca} onChange={(e: any) => onInputChange(e, 'marca')} required />
        {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
      </div>
    </Dialog>

    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
      <div className="confirmation-content">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        <span>Are you sure you want to delete ?</span>
      </div>
    </Dialog>
  </>
);
}


const CataloguePage = () => {
  const { articles, ref, status } = useCatalogue();

  return (
    // <CatalogueGrid p="5" w="full">
    //   {articles.map((article, index) => (
    //     <CatalogueArticle key={article.id} article={article} />
    //   ))}
    //   {status !== "success" && <Box>Cargando...</Box>}
    //   <Box ref={ref} />
    // </CatalogueGrid>
    <>
    <Box ref={ref} />
    <Productos/>
    </>
  );
};

export default CataloguePage;
