import express from "express";
import config from "./config.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(config.PORT, () => {
  console.log(`Servidor activo en puerto ${config.PORT}`);
});
