import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'whatwg-fetch';


const apiHost = window.location.hostname === 'localhost' ? 'localhost' : 'api';

const getProducts = () => fetch(`http://${apiHost}:5001/products`).then(response => response.json())

const Total = ( { items }) =>
<div className="total-item">
  <span>Total</span>
  <span data-total>£ {items.reduce((p, {price}) => p + parseInt(price, 10), 0)}</span>
  <span></span>
</div>

const Product = ({ product, onClick }) =>
<div className="product-item">
  <span>{product.name}</span>
  <span>£ {product.price}</span>
  <span>{onClick && <button onClick={onClick}>Put to cart</button>}</span>
</div>

const CartList = ({ items }) =>
<div className="App-cart" data-cart>
  <h2>Items in cart</h2>
  {items.map( (product,i) => <Product key={i} product={product} />)}
  <hr style={{width:300}} />
  <Total items={items} />
</div>

const ProductList = ({ children }) =>
<div className="App-content" data-content>
  <h2>Product list</h2>
  {children}
</div>

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      cart: []
    }
  }

  async componentDidMount() {
    const products = await getProducts();
    this.setState({ products });
  }


  render() {
    const { products, cart }  = this.state;
    const productList =  products
      .map(product =>
      <Product onClick={() => this.putToCart(product)} key={product.name} product={product} />);

    return (
      <div className="App">
        <div className="App-header" data-welcome>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        {
          !!products.length && <ProductList>{productList}</ProductList>
        }
        {
          !!cart.length && <CartList items={cart} />
        }
      </div>
    );
  }

  putToCart(item) {
    const { cart } = this.state;
    this.setState({ cart: [...cart, item] });
  }
}

export default App;
