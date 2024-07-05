
import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
import cartManager from "../controllers/cartManager.js";

const router = Router();
const manager = new ProductManager();
const cartsManager = new cartManager();

router.get("/realtimeproducts", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;
  const products = await manager.getAll(limit, page, query, sort);
  res.status(200).render("realTimeProducts", { products: products });
});

router.get("/products", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;
  const products = await manager.getAll(limit, page, query, sort);
  const user = req.session.user;
  const userId = user._id.toString();
  const carritoUsu = await cartsManager.getCartByUsuId(userId);
  const userModificado = { ...user, _id: userId };

  res.status(200).render("products",{ products: products , user:userModificado, idCart: carritoUsu._id.toString()});
});

router.get("/register", (req, res) => {
  res.render("register", {});
});

router.get("/login", (req, res) => {
  // Si hay datos de sesión activos, redireccionamos al perfil
  if (req.session.user) return res.redirect("/profile");
  res.render("login", {showError: req.query.error ? true: false, errorMessage: req.query.error});
});

router.get("/profile", (req, res) => {
  // Si NO hay datos de sesión activos, redireccionamos al login
  if (!req.session.user) return res.redirect("/login");
    res.redirect("/products");
});


export default router;

