import { useAuth } from 'hooks/useAuth';
import { ShoppingCartItem } from '../types';
import { StackProps } from '@chakra-ui/react';
import '../../../../global.css'
import { numeroALetras } from 'helpers/numbersToText';

export interface NotaProps extends StackProps {
  client: any
  items: any,
  folio: number
}

const NotaPrint = ( props: NotaProps) => {

  const auth = useAuth();
  const products = props.items;
  let totalLetra = numeroALetras(calculateTotal(products), {
    plural: 'PESOS MEXICANOS',
    singular: 'PESO MEXICANO',
    centPlural: 'CENTAVOS',
    centSingular: 'CENTAVO'
  })

  function calculateTotal(products: ShoppingCartItem[]) {
    let total = 0;
    products.forEach((product) => {
      total += (product.article.attributes.precio_lista * product.amount);
    });
    return total;
  }

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()} ${current.getHours()}:${
    current.getMinutes() < 10
      ? "0" + current.getMinutes()
      : current.getMinutes()
  }`

  return (  
    <div style={{padding: 1, textTransform: 'uppercase', fontFamily: 'Ticketing'}}>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '15px',  marginBottom: '1rem', textAlign: 'center'}}>Comercializadora "San Jose"</label>
      <h6 style={{textAlign: 'center'}}>Central de abastos, puebla, pue.</h6>
      <h6 style={{textAlign: 'center'}}>Nave a bodega 43 y 45</h6>
      <h6 style={{textAlign: 'center'}}>RFC: hurj-950922 pp5</h6>
      <cite style={{ display: 'block', textAlign: 'center'}}>"El exito en la vida no se mide por lo que logras si no por los obstaculos que superas"</cite>
      <div style={{marginTop: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between'}}>
        <h6 style={{textAlign: 'center'}}>{date}</h6>
        <h6 style={{textAlign: 'center'}}>folio: {`00${props.folio}`}</h6>
      </div>
      {/* <div style={{marginTop: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}> */}
        {/* <label style={{height: '40px'}}>Cliente: {props.client?.label}</label> */}
        <h6 style={{textAlign: 'end', marginBottom: '0.5rem'}}>Vend: {auth!.user!.nombre}</h6>
      {/* </div> */}
      <hr/>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '0.5rem'}}>
        <h5>descripcion</h5>
        <h5>precio</h5>
      </div>
      <hr/>
      <div style={{marginBottom: '0.5rem', marginTop: '0.5rem'}}>
        {
          products.map((product: any) => (
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '0.5rem'}}>
              <h6 style={{textOverflow: "ellipsis", width: '70px', whiteSpace: 'nowrap', overflow: 'hidden'}}>{product.article.attributes.nombre}</h6>
              <h6>{`${product.article.attributes.precio_lista} x ${product.amount}`}</h6>
              <h6>${product.article.attributes.precio_lista}</h6>
            </div>
          ))
        }
      </div>
      <hr/>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <h6>subtotal:</h6>
        <h6>${calculateTotal(products)}</h6>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
        <h6>Total:</h6>
        <h6>${calculateTotal(products)}</h6>
      </div>
      <h6>{totalLetra}</h6>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <h6>efectivo:</h6>
        <h6>${calculateTotal(products)}</h6>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
        <h6>total pagos:</h6>
        <h6>${calculateTotal(products)}</h6>
      </div>
      {/* <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <h5>peso total: ....</h5>
      </div> */}
      <h4 style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>{products.length} Articulos vendidos</h4>
      <h4 style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>Gracias por su compra</h4>
    </div>
  );
}

export default NotaPrint;