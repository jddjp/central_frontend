import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { editProduct, getProductById } from "services/api/products";
import { Link, Stack } from '@chakra-ui/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getSubsidiaries } from 'services/api/subsidiary';
import { categoria, estado, initProduct, initStock, unidadMedida } from 'helpers/constants';
import { BASE_URL } from 'config/env';
import { RiExternalLinkLine } from 'react-icons/ri';

interface PropArticleDetail {
  isVisible: boolean,
  referenceId: number,

  onHandleHide: () => void,
}

const ArticlePutDetail = (props: PropArticleDetail) => {

  const queryClient = useQueryClient()
  const updateProduct = useMutation(editProduct)
  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries)

  const [product, setProduct] = useState({
    nombre: "",
    marca: "",
    inventario_fiscal: 0,
    inventario_fisico: 0,
    descripcion: "",
    categoria: "",
    codigo_barras: "",
    codigo_qr: "",
    estado: "",
    foto: "",
    isFiscal: false,
    isFisical: false,
  })
  const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0
  })

  useQuery(["productEdit", props.referenceId], () => getProductById(props.referenceId), {
    onSuccess(data: any) {
      setProduct({
        nombre: data.articulo ? data.articulo.data.attributes.nombre : '',
        marca: data.articulo ? data.articulo.data.attributes.marca : '',
        inventario_fiscal: data.articulo ? data.articulo.data.attributes.inventario_fiscal: 0,
        inventario_fisico: data.articulo ? data.articulo.data.attributes.inventario_fisico : 0,
        descripcion: data.articulo ? data.articulo.data.attributes.descripcion : '',
        categoria: data.articulo ? data.articulo.data.attributes.categoria : '',
        codigo_barras: data.articulo ? data.articulo.data.attributes.codigo_barras : '',
        codigo_qr: data.articulo ? data.articulo.data.attributes.codigo_qr : '',
        estado: data.articulo ? data.articulo.data.attributes.estado : '',
        isFiscal: data.articulo ? data.articulo.data.attributes.isFiscal : false,
        isFisical: data.articulo ? data.articulo.data.attributes.isFisical : false,
        foto: data.articulo ? data?.articulo?.data?.attributes?.foto.data?.attributes?.url : ''
      })
      setStock({ 
        cantidad: data.cantidad ? data.cantidad : 0,
        unidad_de_medida: data.cantidad ? data.unidad_de_medida.data.id : '',
        sucursal: data.sucursal ? data.sucursal.data.id : '',
      })
    },
  })

  const handleUpdateProduct = () => {
    updateProduct.mutate({id: props.referenceId, edit: {data: product}, stock: {data: stock}}, {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
        setProduct(initProduct)
        setStock(initStock)
        props.onHandleHide()
      }
    })
  }
  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.onHandleHide} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleUpdateProduct} />
    </>
  );

  const onInputTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProduct({...product, [e.target.name]: e.target.value});
  }
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setProduct({...product, [tag]: e.value});
  }
  const onDropdownChange = (e: DropdownChangeEvent, tag: string) => {
    setProduct({...product, [tag]: e.target.value});
  }
  const onInputNumberChangeStock = (e: InputNumberChangeEvent, tag: string) => {
    setStock({...stock, [tag]: e.value});
  }
  const onDropdownChangeStock = (e: DropdownChangeEvent, tag: string) => {
    setStock({...stock, [tag]: e.target.value});
  }
  const onUpload = (e: any) => {
    setProduct({...product, [e.target.name]: e.target.files})
  }

  useEffect(() => {
    setProduct({...product, isFiscal: product.inventario_fiscal ? true : false})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.inventario_fiscal]);
  
  useEffect(() => {
    setProduct({...product, isFisical: product.inventario_fisico ? true : false})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.inventario_fisico]);

  return (  
    <Dialog style={{ width: '60%' }} header="Product Details" modal className="p-fluid"
    visible={props.isVisible}  
    footer={productDialogFooter} 
    onHide={props.onHandleHide}>
        <Stack spacing='1rem'>

          <div className="field">
            <label htmlFor="name">Nombre</label>
            <InputText value={product.nombre} onChange={onInputTextChange} autoFocus name='nombre'/>
          </div>
          <div className="field">
            <label htmlFor="name">Marca</label>
            <InputText value={product.marca} onChange={onInputTextChange} name='marca' />
          </div>
          <div className="field">
            <label htmlFor="name">Inventario fiscal</label>
            <InputNumber value={product.inventario_fiscal} onChange={(e: any) => onInputNumberChange(e, 'inventario_fiscal')} required />
          </div>
          <div className="field">
            <label htmlFor="name">Inventario fisico</label>
            <InputNumber value={product.inventario_fisico} onChange={(e: any) => onInputNumberChange(e, 'inventario_fisico')} required />
          </div>
          <div className="field">
            <label htmlFor="name">Descripción</label>
            <InputText value={product.descripcion} onChange={onInputTextChange} required name='descripcion'/>
          </div>
          <div className="field">
            <label htmlFor="name">Cod. barras</label>
            <InputText value={product.codigo_barras} onChange={onInputTextChange} required name='codigo_barras'/>
          </div>
          <div className="field">
            <label htmlFor="name">Cod. Qr</label>
            <InputText value={product.codigo_qr} onChange={onInputTextChange} required name='codigo_qr'/>
          </div>
          <div className="field">
            <label htmlFor="name">Estado</label>
            <Dropdown inputId="dropdown" value={product.estado} options={estado} onChange={(e: any) => onDropdownChange(e, 'estado')} optionLabel="name" />
          </div>
          <div className="field">
            <label htmlFor="name">Categoria</label>
            <Dropdown inputId="dropdown" value={product.categoria} options={categoria} onChange={(e: any) => onDropdownChange(e, 'categoria')} optionLabel="name" />
          </div>

          <div className="field">
            <label htmlFor="name">Cantidad / Stock</label>
            <InputNumber value={stock.cantidad} onChange={(e: any) => onInputNumberChangeStock(e, 'cantidad')} required />
          </div>

          <div className="field">
            <label htmlFor="name">Unidad de Medida</label>
            <Dropdown inputId="dropdown" value={stock.unidad_de_medida} options={unidadMedida} onChange={(e: any) => onDropdownChangeStock(e, 'unidad_de_medida')} optionLabel="name" required/>
          </div>

          <div className="field">
            <label htmlFor="name">Sucursales</label>
            <Dropdown inputId="dropdown" value={stock.sucursal} options={subsidiaries?.map((subsiduary: any) => {
                return {
                  value: subsiduary.id,
                  name: subsiduary.attributes.nombre
                }
              })} 
              onChange={(e: any) => onDropdownChangeStock(e, 'sucursal')} optionLabel="name" required
            />
          </div>
          {/* <FileUpload mode="basic" name="foto" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
          <input type="file" accept="image/*" onChange={onUpload} name='foto'/>
          {typeof product.foto === 'string' && (
            // <a href=>{product.nombre}</a>
            <Link href={`${BASE_URL}${product?.foto}`} isExternal display='inline-flex' alignItems='center' gap='0.5rem' color='blue.600' width='fit-content'>
              {product?.foto}<RiExternalLinkLine size='22px'/>
            </Link>
          )}
        </Stack>
    </Dialog>
  );
}

export default ArticlePutDetail;