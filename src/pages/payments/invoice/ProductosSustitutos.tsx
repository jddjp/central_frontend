import React, { useEffect, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProductService } from 'services/ProductService';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { searchAriclesByStock, searchAriclesByStockOnlyFiscal } from 'services/api/articles';
import { BASE_URL } from 'config/env';
import { pricingCalculator } from 'helpers/pricingCalculator';
import { useToast } from '@chakra-ui/react';
import { InputText } from 'primereact/inputtext';

interface ProductosSustitutosProps {
    usar: (product: any, sustituo: any) => void;
    producto: any;
    cart: any;
}

const ProductosSustitutos = (props: ProductosSustitutosProps) => {
    //export default function ProductosSustitutos({props: ProductosSustitutosProps ) {
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState<any>([]);
    const toast = useToast();

    useEffect(() => {
        //ProductService.getProductsMini().then((data) => setProducts(data));
        getProducts("");
    }, []);

    const formatCurrency = (value: any) => {
        return "$";
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const imageBodyTemplate = (product: any) => {
        return <img src={`${BASE_URL}${product.attributes.articulo.data.attributes.foto.data?.attributes?.url}`} alt={product.image} width="70px" className="shadow-4 p-0" />;
    };

    const priceBodyTemplate = (product: any) => {

        try {
            console.log("---------------------");
            console.log(product.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data);
            const { price, tag } = pricingCalculator(
                product.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rango_ruptura_precios.data,
                //product.attributes.articulo.data.attributes.ruptura_precio.data.attributes.rangos,
                1
                
            );
            
            return price;
            //setCustomPrice(price);
            //tagRef.current = tag;
        } catch (erro) {

            //if (!type) {
            toast({
                //   status: "error",
                description: "Articulo podria no tener ruptura disponible",
            });
            // }
        }
        return formatCurrency(0);
    };

    const statusBodyTemplate = (product: any) => {
        return <Tag value={product.attributes.articulo.data.attributes.inventario_fiscal} severity={getSeverity(product)}></Tag>;
    };

    const usarProducto = (product: any) => {
        //console.log(props.cart);
        // console.log(product);
        let inventarioFiscalUtilizado = 0;
        console.log("-------------------item");
        props.cart.map((item: any) => {
            if (item.sustituto != null) {
                if (product.id == item.sustituto.id) {
                    inventarioFiscalUtilizado += item.product.amount;
                }
            }
        });

        console.log(inventarioFiscalUtilizado);

        if (inventarioFiscalUtilizado >= product.attributes.articulo.data.attributes.inventario_fiscal) {
            toast({ description: "Ya se esta utilizando todo el inventario fiscal disponible de este producto.", });
            return;
        }

        if (props.producto.amount > product.attributes.articulo.data.attributes.inventario_fiscal) {
            toast({ description: "No cuenta con inventario fisico suficiente para usarlo como sustituto.", });
            return;
        }
        props.usar(props.producto, product);
        setVisible(false);
    }

    const statusBodyOpciones = (product: any) => {
        return <Button label="Usar" severity="success" outlined onClick={() => usarProducto(product)} />;
    };

    const getSeverity = (product: any) => {
        if (product.attributes.articulo.data.attributes.inventario_fiscal > 0) {
            return 'success';
        }
        if (product.attributes.articulo.data.attributes.inventario_fiscal == 0) {
            return 'warning';
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Productos</span>
            <Button icon="pi pi-refresh" rounded outlined raised onClick={() => getProducts("")} />
        </div>
    );
    const footer = ` ${products ? products.length : 0} producto(s).`;

    const searchProduct = async (search: string) => {
        const sucurs: Number = Number(localStorage.getItem("sucursal"));
        const resultA = await searchAriclesByStockOnlyFiscal(sucurs.toString(), search)
        return resultA.data;
    };

    const getProducts = async (search: string) => {
        setLoading(true)
        const data = await searchProduct(search);
        console.log(data);

        setProducts(data)
        setLoading(false)
    };

    const onChangeFind = (e: any) =>{
        console.log(e.target.value);
        getProducts(e.target.value);
    }

    return (
        <div className="card flex justify-content-center">
            <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className=' w-6'>

                <span className="p-input-icon-left mb-3">
                    <i className="pi pi-search" />
                    <InputText placeholder="Buscar producto" className='border-round-xl' onInput={onChangeFind}/>
                </span>
                <DataTable value={products} header={header} footer={footer} tableStyle={{ minWidth: '50rem' }} loading={loading}>
                    <Column header="Imagen" body={imageBodyTemplate} style={{ width: '10%' }}></Column>
                    <Column field="attributes.articulo.data.attributes.nombre" header="Nombre" style={{ width: '20%' }}></Column>
                    <Column field="price" header="Precio" body={priceBodyTemplate} style={{ width: '10%' }}></Column>
                    <Column header="Stock" body={statusBodyTemplate} style={{ width: '10%' }}></Column>
                    <Column header="Opciones" style={{ width: '10%' }} body={statusBodyOpciones}></Column>
                </DataTable>
            </Sidebar>
            <Button label="Sustituir" severity="danger" outlined onClick={() => setVisible(true)} size='small' />
        </div>
    )
}
export default ProductosSustitutos;