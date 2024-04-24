import { Router } from "express";
import cartManager from "../cartManager.js";

const router = Router();
const manager = new cartManager("./carts.json");

router.post("/", async (req, res) => {
  try {
    const id = await manager.addCart();
    res.status(200).send({
      origin: "server1",
      payload: "Se creo carrito con exito con id:" + id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});
router.get("/:cid", async (req, res) => {
  try {
    const product = await manager.getCartById(parseInt(req.params.cid));
    res.status(200).send({
      origin: "server1",
      payload: product,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = parseInt(req.params.cid);
    const idProduct = parseInt(req.params.pid);
    const { quantity } = req.body;
    await manager.addToCartId(idCart, idProduct, quantity);
    res.status(200).send({
      origin: "server1",
      payload: "ok",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});
//cid, pid, quantity

export default router;
