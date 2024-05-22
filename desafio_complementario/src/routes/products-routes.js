import { Router } from "express";

import {config} from "../config.js";
import managermdb from "../dao/manager.mdb.js"

const router = Router();
const manager = new managermdb();
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 0;
    const products = await manager.getAll(limit);
    res.status(200).send({ origin: config.SERVER, payload: products });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
      const product = req.body
      const productAdd = await manager.add(req.body);
      res.status(200).send({ origin: config.SERVER, payload: product });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productUpdate=await manager.update(req.params.id,req.body);
    res.status(200).send({ origin: config.SERVER, payload: "PUT" });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productDelete = await manager.delete(req.params.id);
    res.status(200).send({ origin: config.SERVER, payload: "DELETE" });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

export default router;
