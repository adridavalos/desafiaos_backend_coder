import chai from 'chai';
import mongoose from 'mongoose';
import ProductDAO from '../src/services/products.dao.mdb.js';
const connection = await mongoose.connect('mongodb://localhost:27017/ecommerce');
const dao = new ProductDAO();
const expect = chai.expect;

const tesrProduct ={title: "Producto 1",
      description: "Descripción del producto 1",
      price: 29.99,
      thumbnail: "http://example.com/thumbnail1.jpg",
      code: "P001",
      stock: 10,
      status: true,
      category: 1,
      owner: "66c777fb81255f42418e7097"}