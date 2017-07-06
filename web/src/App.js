import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



const Item = ({x, y}) => <div className="item">{x}+{y}={(x + y)}</div>

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
  }

  addItems(e) {
    e.preventDefault();
    const { x: { valueAsNumber: x }, y : { valueAsNumber: y }, form } = this.refs;
    this.setState({loading: true})
    setTimeout(() => {
      this.setState({
        items: [...this.state.items, {x, y}],
        loading: false,
      })
      form.reset();
    }, Math.random() * 2000)
  }

  render() {
    const { loading, items }  = this.state;
    return (
      <div className="App">
        <div className="App-header" data-welcome>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          Add X to Y and see results
        </p>
        <form onSubmit={ (e) => this.addItems(e) } id="theform" ref="form">
          X: <input name="X" ref="x" type="number" data-x required placeholder="number"/>
          Y: <input name="Y" ref="y" type="number" data-y required placeholder="number"/>
          <button data-submit disabled={loading}>Add{loading && 'ing'}</button>
        </form>
        {!!items.length && <div data-results>
          {items.map( ({x, y}, i) => <Item  key={i} x={x} y={y} />)}
        </div>}
      </div>
    );
  }
}

export default App;
