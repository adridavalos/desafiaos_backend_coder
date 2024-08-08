
import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
import cartManager from "../controllers/cartManager.js";
import {handlePolicies, current } from "../services/utils.js";

const router = Router();
const manager = new ProductManager();
const cartsManager = new cartManager();

router.get("/realtimeproducts", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const user = current(req);
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;
  const products = await manager.getAll(limit, page, query, sort);
  const userId = user._id;
  const carritoUsu = await cartsManager.getCartByUsuId(userId);
  const userModificado = { ...user, _id: userId };
  res.status(200).render("realTimeProducts", { products: products , user:userModificado, idCart: carritoUsu._id.toString() });
});

router.get("/products",handlePolicies('user'), async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const user = current(req);
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;
  const products = await manager.getAll(limit, page, query, sort);
  const userId = user._id;
  const carritoUsu = await cartsManager.getCartByUsuId(userId);
  const userModificado = { ...user, _id: userId };
  res.status(200).render("products",{ products: products , user:userModificado, idCart: carritoUsu._id.toString()});
});

router.get("/register", (req, res) => {
  res.render("register", {});
});

router.get("/login", (req, res) => {
  // Si hay datos de sesión activos, redireccionamos al perfil
  res.render("login", {showError: req.query.error ? true: false, errorMessage: req.query.error});
});
router.get("/modify/:pid", async (req, res) => {
  
  const product = await manager.getById( req.params.pid);
  const user = current(req);
  
  res.status(200).render("modifyProduct", {product:product , user:user});
  
});


export default router;

