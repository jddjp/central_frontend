import React, { useState } from 'react'
import { Box } from "@chakra-ui/react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "./style.css"
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getProducts, postProduct, deleteProduct, editProduct } from 'services/api/products';

const BASE_URL = process.env.REACT_APP_BASE_URL

let initProduct = {
  nombre: '',
  precio_lista: 0,
  marca: '',
  inventario_fiscal: 0,
  inventario_fisico: 0,
  descripcion: "",
  categoria: "",
  codigo_barras: "",
  codigo_qr: "",
  estado: "",
  foto: "",
  unidad_de_medida:1
}

export const Productos = () => {

  const queryClient = useQueryClient()
  const { data: products } = useQuery(["products"], getProducts)
  const createProduct = useMutation(postProduct)
  const removeProduct = useMutation(deleteProduct)
  const updateProduct = useMutation(editProduct)

  const [product, setProduct] = useState(initProduct);
  const [edit, setEdit] = useState(initProduct)

  const [id, setId] = useState('');
  const [productDialog, setProductDialog] = useState(false);
  const [editProductDialog, seteditroductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

  const openNew = () => {
    setProductDialog(true);
  }
  const openEdit = (data :  any) => {
    const articulos = data.attributes;
    
    edit.nombre = articulos?.nombre
    edit.marca = articulos?.marca
    edit.estado = articulos.estado
    edit.categoria = articulos.categoria 
    edit.codigo_barras = articulos.codigo_barras 
    edit.inventario_fiscal = articulos.inventario_fiscal 
    edit.inventario_fisico = articulos.inventario_fisico 
    edit.precio_lista = articulos.precio_lista 
    edit.foto = articulos?.foto?.data?.attributes?.url 
    edit.descripcion = articulos.descripcion
    edit.codigo_qr = articulos.codigo_qr
 
    setId(data.id)
    seteditroductDialog(true);

  }
  const hideDialog = () => {
    setProductDialog(false);
    seteditroductDialog(false)
    
  }
  const hideDeleteProductDialog = () => {
    setId('')
    setDeleteProductDialog(false);
  }
  const confirmDeleteProduct = (id: string) => {
    setId(id)
    setDeleteProductDialog(true);
  }

  const saveProduct = () => {
    createProduct.mutate({ data: product }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
        setProduct(initProduct)
        setProductDialog(false);
      }
    })
  }
  const updateProducts = () => {
    updateProduct.mutate({id: id, edit: {data: edit}}, {
      onSuccess: () => {
        setEdit(initProduct)
        seteditroductDialog(false);
      }
    })
  }

const handleDeleteProduct = () => {
  removeProduct.mutate(id, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
        setId('')
        setDeleteProductDialog(false)
      }
    })
  }

  const myUploader = (e:any, name:any) => {
    setProduct({...product, [name]: e.target.files[0]})
  }
  const myUploaderEdit = (e:any, name:any) => {
    setEdit({...edit, [name]: e.target.files[0]})
  }
  
  const onInputChange = (e: any, name: any) => {
    setProduct({...product, [name]: e.target.value});
  }
  const onInputNumberChange = (e:any, name:any) => {
    console.log(e);
    setProduct({...product, [name]: e.value});
  }
  const onInputChangeEdit = (e: any, name: any) => {
    setEdit({...edit, [name]: e.target.value});
  }
  const onInputNumberChangeEdit = (e:any, name:any) => {
    setProduct({...edit, [name]: e.value});
  }

  const onGlobalFilterChange1 = (e: any) => {
    setGlobalFilterValue1(e.target.value);
  }

  const estado = [{ name: 'bueno', value: 'bueno' }];
  const unidadMedida = [{ name: 'kg', value: '1' },{ name: 'litros', value: '2' }];


  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
  );
  const editProductDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={updateProducts}/>
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={handleDeleteProduct} />
    </React.Fragment>
  );


  return (
    <>
      <DataTable paginator className="p-datatable-customers" showGridlines rows={10}  editMode="row" 
        value={products?.map((product: any) => product)} 
        header={
          <Box display='flex' justifyContent='flex-start'>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} />
              <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
            </span>
          </Box>
        } 
        filters={{
          'attributes.nombre': { value: globalFilterValue1, matchMode: FilterMatchMode.STARTS_WITH }
        }}>
        <Column field="attributes.nombre" header="Nombre" />
        <Column field="attributes.precio_lista" header="Precio" />
        <Column field="attributes.marca" header="Marca" />
        <Column field="attributes.inventario_fiscal" header="inventario_fiscal" style={{ width: "5%" }} />
        <Column field="attributes.inventario_fisico" header="Inventario fisico" style={{ width: "5%" }} />
        <Column field="attributes.descripcion" header="Dsscripcion" style={{ width: "20%" }} />
        <Column field="attributes.categoria" header="Categoria" />
        <Column field="attributes.codigo_barras" header="Cod. Barra" />
        <Column field="attributes.codigo_qr" header="Cod. Qr" />
        <Column field="attributes.estado" header="Estado"/>
        <Column body={(data: any) => ( 
          <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openEdit(data)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(data.id)} />
          </>)} 
          exportable={false} style={{ minWidth: '8rem' }} />
      </DataTable>

      {/* new */}
      <Dialog visible={productDialog} style={{ width: '60%' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

        <div className="field">
          <label htmlFor="name">Nombre</label>
          <InputText value={product.nombre} onChange={(e: any) => onInputChange(e, 'nombre')} autoFocus />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Marca</label>
          <InputText value={product.marca} onChange={(e: any) => onInputChange(e, 'marca')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Precio</label>
          <InputNumber value={product.precio_lista} onChange={(e: any) => onInputNumberChange(e, 'precio_lista')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fiscal</label>
          <InputNumber value={product.inventario_fiscal} onChange={(e: any) => onInputNumberChange(e, 'inventario_fiscal')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fisico</label>
          <InputNumber value={product.inventario_fisico} onChange={(e: any) => onInputNumberChange(e, 'inventario_fisico')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Descripción</label>
          <InputText value={product.descripcion} onChange={(e: any) => onInputChange(e, 'descripcion')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Cod. barras</label>
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
          {/* <InputText  value={product.estado} onChange={(e: any) => onInputChange(e, 'estado')} required /> */}
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
          <Dropdown inputId="dropdown" value={product.estado} options={estado} onChange={(e: any) => onInputChange(e, 'estado')} optionLabel="name" />
          {/* <label htmlFor="dropdown">Dropdown</label> */}
        </div>
        <div className="field">
          <label htmlFor="name">Unidad de Medida</label>
          {/* <InputText  value={product.estado} onChange={(e: any) => onInputChange(e, 'estado')} required /> */}
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
          <Dropdown inputId="dropdown" value={product.unidad_de_medida} options={unidadMedida} onChange={(e: any) => onInputChange(e, 'unidad_de_medida')} optionLabel="name" />
          {/* <label htmlFor="dropdown">Dropdown</label> */}
        </div>
       
     
        <div >
          <form action="">
            <input type="file" accept="image/*" onChange={(e) => myUploader(e, 'foto')}/>
            <img src={product.foto} alt="" />
          </form>
        </div>
      </Dialog>

      {/* edit */}
      <Dialog visible={editProductDialog} style={{ width: '60%' }} header="Product Details" modal className="p-fluid" footer={editProductDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <InputText value={edit.nombre} onChange={(e: any) => onInputChangeEdit(e, 'nombre')} autoFocus />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Marca</label>
          <InputText value={edit.marca} onChange={(e: any) => onInputChangeEdit(e, 'marca')} />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Precio</label>
          <InputNumber value={edit.precio_lista} onChange={(e: any) => onInputNumberChangeEdit(e, 'precio_lista')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fiscal</label>
          <InputNumber value={edit.inventario_fiscal} onChange={(e: any) => onInputNumberChangeEdit(e, 'inventario_fiscal')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fisico</label>
          <InputNumber value={edit.inventario_fisico} onChange={(e: any) => onInputNumberChangeEdit(e, 'inventario_fisico')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Descripción</label>
          <InputText value={edit.descripcion} onChange={(e: any) => onInputChangeEdit(e, 'descripcion')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Cod. barras</label>
          <InputText value={edit.codigo_barras} onChange={(e: any) => onInputChangeEdit(e, 'codigo_barras')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Cod. Qr</label>
          <InputText value={edit.codigo_qr} onChange={(e: any) => onInputChangeEdit(e, 'codigo_qr')} required />
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
        </div>
        <div className="field">
          <label htmlFor="name">Estado</label>
          {/* <InputText  value={product.estado} onChange={(e: any) => onInputChangeEdit(e, 'estado')} required /> */}
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
          <Dropdown inputId="dropdown" value={edit.estado} options={estado} onChange={(e: any) => onInputChangeEdit(e, 'estado')} optionLabel="name" />
          {/* <label htmlFor="dropdown">Dropdown</label> */}
        </div>
        <div className="field">
          <label htmlFor="name">Unidad de Medida</label>
          {/* <InputText  value={product.estado} onChange={(e: any) => onInputChange(e, 'estado')} required /> */}
          {/* {submitted && !product.name && <small className="p-error">Name is required.</small>} */}
          <Dropdown inputId="dropdown" value={edit.unidad_de_medida} options={unidadMedida} onChange={(e: any) => onInputChange(e, 'unidad_de_medida')} optionLabel="name" />
          {/* <label htmlFor="dropdown">Dropdown</label> */}
        </div>
  
        <div >
          <form action="">
            <input type="file" accept="image/*" onChange={(e) => myUploaderEdit(e, 'foto')}/>
            <img src={`${BASE_URL}${edit.foto}`} alt="" />
          </form>
        </div>

      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>¿Estas seguro que quieres que eliminarlo? </span>
        </div>
      </Dialog>
    </>
  );
}

const CataloguePage = () => {

  return (
    <Box>
      <Productos/>
    </Box>
  );
};

export default CataloguePage;
