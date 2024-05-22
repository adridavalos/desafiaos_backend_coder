import { Router } from "express";
import cartManager from "../cartManager.js";
import config from "../config.js";

const router = Router();
const manager = new cartManager(`${config.DIRNAME}/carts.json`);

// La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
// Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
// products: Array que contendrá objetos que representen cada producto


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

// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el 
//parámetro cid proporcionados.



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

// La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, 
// agregándose como un objeto bajo el siguiente formato:
// product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
// quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará
// de uno en uno.

// Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho 
// producto.


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

export default router;
