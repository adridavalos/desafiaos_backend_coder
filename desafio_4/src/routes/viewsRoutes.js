
import { Router } from "express";
import ProductManager from "../ProductManager.js";
import config from "../config.js";

const router = Router();
const manager = new ProductManager(`${config.DIRNAME}/products.json`);

router.get("/", async (req, res) => {
  const limit = req.query.limit || 0;
  const products = await manager.getProducts(limit);
  res.status(200).render("realTimeProducts", { products: products });
});

export default router;
