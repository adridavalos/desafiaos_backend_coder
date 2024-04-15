import express from "express";
import ProductManager from "./ProductManager.js";

const manager = new ProductManager("./products.json");
const PORT = 8080;

const app = express();

app.get("/products", async (req, res) => {
  const limit = req.query.limit || 0;
  const products = await manager.getProducts(limit);
  res.send({ status: 1, payload: products });
});
app.get("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductById(id);
  if (product) {
    res.send({ status: 1, payload: product });
  } else {
    res.send({ status: 0, payload: "El producto no existe" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
