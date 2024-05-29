
import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
   const limit = req.query.limit;
   const page = req.query.page;
   const query = req.query.query;
   const sort = req.query.sort;
   const products = await manager.getAll(limit, page, query, sort);
  const mappedProducts = products.docs.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
  }));
  res.status(200).render("realTimeProducts", { products: mappedProducts });
});

router.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;
  const products = await manager.getAll(limit, page, query, sort);
  const mappedProducts = products.docs.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
  }));
  res.status(200).render("products", { products: mappedProducts });
});

export default router;

