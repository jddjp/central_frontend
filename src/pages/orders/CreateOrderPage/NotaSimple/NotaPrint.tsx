import { useAuth } from 'hooks/useAuth';
import { ShoppingCartItem } from '../types';
import { StackProps } from '@chakra-ui/react';
import '../../../../global.css'

export interface NotaProps extends StackProps {
  client: any
  items: any
}

const NotaPrint = ( props: NotaProps) => {

  const auth = useAuth();
  const products = props.items;
  

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
    <div style={{padding: 1}} className='nota-printed'>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '20px',  marginBottom: '1rem', textAlign: 'center'}}>Comercializadora "San Jose"</label>
      <h5 style={{fontWeight: 'bold'}}>Central de abastos, puebla</h5>
      <cite style={{ display: 'block', fontWeight: 'bold'}}>"El exito en la vida no se mide por lo que logras si no por los obstaculos que superas"</cite>
      <h5 style={{marginTop: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold'}}>{date}</h5>
      <div style={{marginTop: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
        <label style={{height: '40px'}}>Cliente: {props.client?.label}</label>
        <label style={{height: '40px'}}>Vendedor: {auth!.user!.nombre}</label>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>Total: {calculateTotal(products)}</label>
        <label style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>Articulos vendidos: {products.length}</label>
        <label style={{ display: 'block', fontWeight: 'bold',  marginTop: '1rem', textAlign: 'center'}}>Gracias por su compra</label>
      </div>
    </div>
  );
}

export default NotaPrint;