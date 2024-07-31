import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
import config from '../config.js';
import { handlePolicies,verifyRequiredBody } from "../services/utils.js";

const router = Router();
const manager = new ProductManager();

router.param("pid", async (req, res, next, pid) => {
  if (!config.MONGODB_ID_REGEX.test(req.params.pid)) {
    return res
      .status(400)
      .send({ origin: config.SERVER, payload: null, error: "Id no válido" });
  }

  next();
});

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;
  const products = await manager.getAll(limit,page,query,sort);
  res.status(200).render("home", { products: products });
});
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  const product = await manager.getById(id);
  if (product) {
    res.status(200).send({ status: 1, payload: product.docs});
  } else {
    res.send({ status: 0, payload: "El producto no existe" });
  }
});

router.post("/",handlePolicies('admin'),verifyRequiredBody(['title', 'description', 'price', 'thumbnail','code','stock']),async (req, res) => {
  try {
    const socketServer = req.app.get("socketServer");
    const id = await manager.add(req.body);
    res.status(200).send({
      origin: "server1",
      payload:req.body,
    });
    socketServer.emit("productsChanged", req.body);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});

router.put("/:pid",handlePolicies('admin'), async (req, res) => {
  try {
    const socketServer = req.app.get("socketServer");
    const filter = { _id: req.params.pid };
    const update = req.body;
    const options = { new: true };
    await manager.update(filter,update,options);
    res.status(200).send({
      origin: "server1",
      payload: `Se modifico el producto con id: ${req.params.pid}`,
    });
    socketServer.emit("productsChanged", req.body);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ origin: "server1", payload: error.message });
  }
});

router.delete('/:pid', handlePolicies('admin'), async (req, res) => {
  try {
      const { pid } = req.params;

      const socketServer = req.app.get('socketServer'); 
      const result = await manager.delete({ _id: pid });

      socketServer.emit('productsChanged', { message: 'Producto eliminado' });

      if (result) {
          res.status(200).send({
              origin: "server1",
              message: "Producto eliminado exitosamente."
          });
      } else {
          res.status(404).send({
              origin: "server1",
              message: "Producto no encontrado."
          });
      }
  } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).send({
          origin: "server1",
          message: "Error al eliminar el producto."
      });
  }
});

router.all('*', async(req,res)=>{
  res.status(404).send({origin: config.SERVER, payload:null, error:'No se encuentra la ruta solicitada'});
})

export default router;

//Observacion http://localhost:8080/api/products?query={"category":8} le paso asi la query lo mismo con sort para que funcione el pedido get
//http://localhost:8080/api/products?query={"category":8}&sort={"price":1}