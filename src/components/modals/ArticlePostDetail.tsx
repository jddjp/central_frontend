import { ChangeEvent, useEffect, useState } from 'react'
import { Stack } from "@chakra-ui/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSubsidiaries } from '../../services/api/subsidiary';
import { postProduct } from 'services/api/products';
import { categoria, estado, initProduct, initStock } from 'helpers/constants';
import { getUnidades } from 'services/api/articles';

interface PropsArticleDetail {
  isVisible: boolean,
  onHandleHide: () => void
}

const ArticleDetail = (props: PropsArticleDetail) => {

  const queryClient = useQueryClient()
  const { data: subsidiaries } = useQuery(["subsidiaries"], getSubsidiaries)
  const { data: unidadMedida } = useQuery(["unidades"], getUnidades)
  const createProduct = useMutation(postProduct)

  const [product, setProduct] = useState({
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
    // peso: "",
    isFiscal: false,
    isFisical: false,
    fresh: true,
    unidad_de_medida: 0
  });
  
  const [stock, setStock] = useState({
    cantidad: 0,
    sucursal: 0,
    unidad_de_medida: 0
  })

  const handleSaveProduct = () => {
    product.unidad_de_medida = stock.unidad_de_medida;
    createProduct.mutate({ product: {data: product}, stock: {data: stock} }, {
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
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSaveProduct} />
    </>
  );

  const onInputTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProduct({...product, [e.target.name]: e.target.value});
  }
  const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
    setProduct({...product, [tag]: e.value ?? 0});
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
    setProduct({...product, [e.target.name]: e.target.files[0]})
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
      <Stack spacing='2'>

        <div className="field">
          <label htmlFor="name">Nombre</label>
          <InputText value={product.nombre} onChange={onInputTextChange} autoFocus name='nombre'/>
        </div>
        <div className="field">
          <label htmlFor="name">Marca</label>
          <InputText value={product.marca}  onChange={onInputTextChange} name='marca'/>
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fiscal</label>
          <InputNumber value={product.inventario_fiscal} onChange={(e) => onInputNumberChange(e, 'inventario_fiscal')} required />
        </div>
        <div className="field">
          <label htmlFor="name">Inventario fisico</label>
          <InputNumber value={product.inventario_fisico} onChange={(e) => onInputNumberChange(e, 'inventario_fisico')} required />
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
          <Dropdown value={product.estado} inputId="dropdown" options={estado} onChange={(e) => onDropdownChange(e, 'estado')} optionLabel="name"/>
        </div>
        <div className="field">
          <label htmlFor="name">Categoria</label>
          <Dropdown value={product.categoria} inputId="dropdown" options={categoria} onChange={(e) => onDropdownChange(e, 'categoria')} optionLabel="name"/>
        </div>

        {/* STOCKS  */}
        <div className="field">
          <label htmlFor="name">Cantidad / Stock</label>
          <InputNumber value={stock.cantidad} onChange={(e) => onInputNumberChangeStock(e, 'cantidad')} required/>
        </div>
        <div className="field">
          <label htmlFor="name">Unidad de Medida</label>
          <Dropdown value={stock.unidad_de_medida} inputId="dropdown" options={unidadMedida} onChange={(e) => onDropdownChangeStock(e, 'unidad_de_medida')} optionLabel="name" required/>
        </div>
        <div className="field">
          <label htmlFor="name">Sucursales</label>
          <Dropdown value={stock.sucursal} inputId="dropdown" options={subsidiaries?.map((subsiduary: any) => {
              return {
                value: subsiduary.id,
                name: subsiduary.attributes.nombre
              }
            })} 
            onChange={(e) => onDropdownChangeStock(e, 'sucursal')} optionLabel="name" required
          />
        </div>
        <div >
          <form action="">
            <input type="file"  accept="image/*" onChange={onUpload} name='foto'/>
          </form>
        </div>
      </Stack>
    </Dialog>
  );
}

export default ArticleDetail;
