const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = new Express();

let productDb = [
  { name: 'Tea', price: 8 },
  { name: 'Short bread', price: 4 },
  { name: 'Blue Stilton', price: 3 }
];

app.get("/products", cors(), (r, res) => {
  res.json(productDb);
})

app.post("/products", bodyParser.json(), (req, res) => {
  productDb = req.body;
  res.json(productDb);
})

app.listen('5001', () => console.log('service started'));