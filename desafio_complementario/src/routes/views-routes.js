import { Router } from "express";

import {config} from "../config.js";

const router = Router();

router.get("/products", (req, res) => {
    const data =[];
  res.render("products", { data: data });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

export default router;
