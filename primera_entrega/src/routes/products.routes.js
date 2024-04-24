import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const manager = new ProductManager("./products.json");

router.get("/", async (req, res) => {
  const limit = req.query.limit || 0;
  const products = await manager.getProducts(limit);
  res.status(200).send({ status: 1, payload: products });
});
router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductById(id);
  if (product) {
    res.status(200).send({ status: 1, payload: product });
  } else {
    res.send({ status: 0, payload: "El producto no existe" });
  }
});

router.post("/", async (req, res) => {
  try {
    const id = await manager.addProduct(req.body);
    res.status(200).send({
      origin: "server1",
      payload: `Se agrego correctamente id: ${id}`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    await manager.updateProduct(parseInt(req.params.pid), req.body);
    res.status(200).send({
      origin: "server1",
      payload: `Se modifico el producto con id: ${parseInt(req.params.pid)}`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});
router.delete("/:pid", async (req, res) => {
  try {
    await manager.deleteProduct(parseInt(req.params.pid));
    res.status(200).send({
      origin: "server1",
      payload: `Se elimino el producto con id: ${parseInt(req.params.pid)}`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});

export default router;
