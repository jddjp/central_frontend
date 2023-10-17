
import {ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { InputNumber, InputNumberChangeEvent, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { deleteStockById, getStock, postStock, putStock } from 'services/api/stocks';
import { Stock } from 'types/Stock';

export const onCellEditComplete = (e: ColumnEvent) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
        case 'attributes.cantidad':
            if (isPositiveInteger(newValue)) rowData.attributes.cantidad = newValue;
            else event.preventDefault();
            break;

        default:
            if (newValue.trim().length > 0) rowData[field] = newValue;
            else event.preventDefault();
            break;
    }
};

const isPositiveInteger = (val: any) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
        return false;
    }

    str = str.replace(/^0+/, '') || '0';
    let n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
};

export const priceBodyTemplate = (rowData: any) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
  };

  export const recuperarCantidad = (data_table: any[], selected_sucursales: any[]) => {
    const setTable = new Set(data_table);
    const dataSelectedSucursales = new Set(selected_sucursales);
    const resultado: any[] = [];

    for (const elemento of setTable) {
      if (dataSelectedSucursales.has(elemento.attributes.sucursal.data.id)) {
        resultado.push(elemento);
      }
    }

    return resultado;
  }

  export const validarExistenciaUnidadEnStock = (stock: Stock[], idUnidad: number) => {
    // Utiliza el método some() para verificar si el id de unidad se encuentra en alguno de los objetos en el arreglo.
    return stock.some((item) => item.attributes?.sucursal?.data?.id === idUnidad);
  }

  export const validLimitStock = (stock: any) => {
    let suma = 0;
    stock.map((item: Stock) => {
      suma += item.attributes?.cantidad || 0;
    })
    return suma;
  }

  export const textEditor = (options: ColumnEditorOptions) => {
    const options2: any = options.editorCallback;
    if (options2) {
      return <InputText type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (options.editorCallback) {
          options.editorCallback(e.target.value);
        }
      }} />;
    }
    return ""
  };

  export const priceEditor = (options: ColumnEditorOptions) => {
    const options2: any = options.editorCallback;
    if (options2) {
      return <InputNumber value={options.value} onValueChange={(e: InputNumberValueChangeEvent) => {
        if (options.editorCallback) {
          options.editorCallback(e.target.value);
        }
      }} />;
    }
    return ""
  };

  export const cellEditor = (options: ColumnEditorOptions) => {
    if (options.field === 'attributes.cantidad') return priceEditor(options);
    if (options.field === 'attributes.sucursal.data.attributes.nombre') return options.value;
    else return textEditor(options);
  };

  export const saveStockProd = async (id_producto: number, stockProduct: any, product : any, selectedStoresForDeletion:any) => {
    const listStock: any[] = stockProduct;
    if (listStock != null) {
      const promises = listStock.map(async (stock: Stock) => {
        const stockData = await getStock(id_producto, stock.attributes?.sucursal?.data?.id);
        if (stockData.data.length == 0) {
          //Agrega nuevo stock
          postStock({
            data: {
              cantidad: stock.attributes?.cantidad,
              sucursal: stock.attributes?.sucursal?.data?.id,
              unidad_de_medida: product.unidad_de_medida,
              articulo: id_producto
            }
          })
        }

        if (stockData.data.length > 0) {
          //Actualiza stock
          putStock(stockData.data[0].id, {
            data: {
              cantidad: stock.attributes?.cantidad,
              sucursal: stock.attributes?.sucursal?.data?.id,
              unidad_de_medida: product.unidad_de_medida,
              articulo: id_producto
            }
          })
        }

      })
      await Promise.all(promises);
    }
    
    const promises = selectedStoresForDeletion.map(async (sucursal: any) => {
      const stockData = await getStock(id_producto, sucursal);
      if (stockData.data.length > 0) {
        await deleteStockById(stockData.data[0].id);
      }
    })
    await Promise.all(promises);
  }