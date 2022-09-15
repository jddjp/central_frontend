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
import { Dropdown } from 'primereact/dropdown';
export const Productos = () => {
  let emptyProduct = {
    nombre: '',
    precio_lista: 0,
    marca: '',
    inventario_fiscal: 0,
    inventario_fisico: 0,
    descripcion: "",
    categoria: "",
    codigo_barras: "",
    codigo_qr: "",
    estado: ""
  };
  const [sales, setSales] = useState([])
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [edit, setEdit] = useState([])
  useEffect(() => {
    appAxios.get(`/articulos?populate=foto`).then((response: { data: any; }) => {
      const data = response.data
      setSales(data.data)
    })


  }, []);
  const ped = sales.map((data: any) => {
    return data
  })
  const id = sales.map((data: any) => {
    return data.id
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
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  }
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  }
  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  }


  const saveProduct = () => {
    setSubmitted(true);

   // if (product.nombre != null) {
      if (product.nombre.trim()) {
      //     let _products = [...products];
      // let _product = {...product};
      // if(product.)
      let data = {
        data: { ...product },
      };
      appAxios.post(`/articulos`, data);

      console.log(edit);


      // setProducts(_products);
      setProductDialog(false);

    }
  //}
  }

  const editProduct = (data: any) => {
    setProduct({ ...data.attributes });
    setEdit(data.id)
    console.log(data.id);

    setProductDialog(true);
  }
  const deleteProduct = () => {


    appAxios
      .delete(`/articulos/${edit}`)
      .then(() => {
        window.location.reload()

      });

  }

  const confirmDeleteProduct = (data: any) => {
    console.log(data);
    setEdit(data)
    setDeleteProductDialog(true);
  }
  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
  //  _product[`${name}`] = val;

   // setProduct(_product);
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
  // console.log(id);

  const estado = [{label:'bueno', value:'bueno'}];
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
    </React.Fragment>
  );


  return (
    <>
      <div className="card container">
        <DataTable value={ped} paginator className="p-datatable-customers" showGridlines rows={10} header={header} filters={filters} editMode="row">
          <Column field="attributes.nombre" header="Nombre" />
          <Column field="attributes.precio_lista" header="Precio" />
          <Column field="attributes.marca" header="Marca" />
          <Column field="attributes.inventario_fiscal" header="inventario_fiscal" style={{ width: "5%" }} />
          <Column field="attributes.inventario_fisico" header="Inventario fisico" style={{ width: "5%" }} />
          <Column field="attributes.descripcion" header="Dsscripcion" style={{ width: "20%" }} />
          <Column field="attributes.categoria" header="Categoria" />
          <Column field="attributes.codigo_barras" header="Cod. Barra" />
          <Column field="attributes.codigo_qr" header="Cod. Qr" />
          <Column field="attributes.estado" header="EStado" />
          {/* <Column header="attributes.Foto" body={(data: any) => {
          return <img src={baseMediaUrl + data.attributes.foto.data.attributes.url} alt="producto" width="25" />
        }} /> */}
          <Column body={(data: any) => {
            return <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(data)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(data.id)} />
            </div>
          }} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>




      <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <InputText value={product.nombre} onChange={(e: any) => onInputChange(e, 'nombre')} required autoFocus />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Marca</label>
          <InputText value={product.marca} onChange={(e: any) => onInputChange(e, 'marca')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Precio</label>
          <InputText value={product.precio_lista} onChange={(e: any) => onInputChange(e, 'precio_lista')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fiscal</label>
          <InputText value={product.inventario_fiscal} onChange={(e: any) => onInputChange(e, 'inventario_fiscal')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fisico</label>
          <InputText value={product.inventario_fisico} onChange={(e: any) => onInputChange(e, 'inventario_fisico')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Descripcion</label>
          <InputText value={product.descripcion} onChange={(e: any) => onInputChange(e, 'descripcion')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">cod. barras</label>
          <InputText value={product.codigo_barras} onChange={(e: any) => onInputChange(e, 'codigo_barras')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Cod. Qr</label>
          <InputText value={product.codigo_qr} onChange={(e: any) => onInputChange(e, 'codigo_qr')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Estado</label> 
        <InputText  value={product.estado} onChange={(e: any) => onInputChange(e, 'estado')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
          {/* <Dropdown inputId="dropdown" value={product.estado} options={estado} onChange={(e: any) => onInputChange(e, 'estado')} optionLabel="name" /> */}
          {/* <label htmlFor="dropdown">Dropdown</label> */}
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
      <Productos />
    </>
  );
};

export default CataloguePage;
