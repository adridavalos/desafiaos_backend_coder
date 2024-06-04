
import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/realtimeproducts", async (req, res) => {
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
  res.status(200).render("products",{ products: mappedProducts , user: req.session.user });
});

router.get("/register", (req, res) => {
  res.render("register", {});
});

router.get("/login", (req, res) => {
  // Si hay datos de sesión activos, redireccionamos al perfil
  if (req.session.user) return res.redirect("/profile");
  res.render("login", {});
});

router.get("/profile", (req, res) => {
  // Si NO hay datos de sesión activos, redireccionamos al loginm
  if (!req.session.user) return res.redirect("/login");
    res.redirect("/products");
});


export default router;

