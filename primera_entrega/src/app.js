import express from "express";
import config from "./config.js";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(config.PORT, () => {
  console.log(`Servidor activo en puerto ${config.PORT}`);
});
