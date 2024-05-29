import express from "express";
import handlebars from "express-handlebars";
import mongoose from 'mongoose'

import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import viewRouter from "./routes/viewsRoutes.js";
import config from "./config.js";
import initSoket from "./sockets.js";
const app = express();

const expressInstance = app.listen(config.PORT, async() => {
  await mongoose.connect(config.MONGODB_URI);

  const socketServer = initSoket(expressInstance);
  app.set("socketServer", socketServer); //referencia global

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.engine("handlebars", handlebars.engine());
  app.set("views", `${config.DIRNAME}/views`);
  app.set("view engine", "handlebars");

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/realtimeproducts", viewRouter);
  app.use("/views", viewRouter);
  app.use("/static", express.static(`${config.DIRNAME}/public`));

  console.log(`Servidor activo en puerto ${config.PORT}`);
});