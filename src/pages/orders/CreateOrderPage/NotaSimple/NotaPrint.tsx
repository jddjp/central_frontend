import { useAuth } from 'hooks/useAuth';
import { ShoppingCartItem } from '../types';
import { StackProps } from '@chakra-ui/react';
import '../../../../global.css'
import { numeroALetras } from 'helpers/numbersToText';

export interface NotaProps extends StackProps {
  client: any
  items: any
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
    <div style={{padding: 1, textTransform: 'uppercase', fontFamily: 'Ticketing'}} className='nota-printed'>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '20px',  marginBottom: '1rem', textAlign: 'center'}}>Comercializadora "San Jose"</label>
      <h5>Central de abastos, puebla, pue.</h5>
      <h5>Nave a bodega 43 y 45</h5>
      <h5>RFC: hurj-950922 pp5</h5>
      <cite style={{ display: 'block'}}>"El exito en la vida no se mide por lo que logras si no por los obstaculos que superas"</cite>
      <div style={{marginTop: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between'}}>
        <h5>{date}</h5>
        <h5>folio: .....</h5>
      </div>
      {/* <div style={{marginTop: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}> */}
        {/* <label style={{height: '40px'}}>Cliente: {props.client?.label}</label> */}
        <h5 style={{textAlign: 'end', marginBottom: '0.5rem'}}>Vend: {auth!.user!.nombre}</h5>
      {/* </div> */}
      <hr/>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '0.5rem'}}>
        <label>descripcion</label>
        <label>precio</label>
      </div>
      <hr/>
      <div style={{marginBottom: '0.5rem', marginTop: '0.5rem'}}>
        {
          products.map((product: any) => (
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '0.5rem'}}>
              <h5>{product.article.attributes.nombre}</h5>
              <h5>{product.article.attributes.precio_lista}</h5>
            </div>
          ))
        }
      </div>
      <hr/>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <h5>subtotal:</h5>
        <h5>{calculateTotal(products)}</h5>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
        <h5>Total:</h5>
        <h5>{calculateTotal(products)}</h5>
      </div>
      <h5>{totalLetra}</h5>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <h5>efectivo:</h5>
        <h5>{calculateTotal(products)}</h5>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
        <h5>total pagos:</h5>
        <h5>{calculateTotal(products)}</h5>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <h5>peso total: ....</h5>
      </div>
      <label style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>{products.length} Articulos vendidos</label>
      <label style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>Gracias por su compra</label>
    </div>
  );
}

export default NotaPrint;