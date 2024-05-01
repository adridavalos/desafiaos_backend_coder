import express from "express";
import config from "./config.js";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import viewRouter from "./routes/viewsRoutes.js";

import handlebars from "express-handlebars";

import { Server } from "socket.io";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/realtimeproducts", viewRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

app.use("/static", express.static(`${config.DIRNAME}/public`));
const httpServer = app.listen(config.PORT, () => {
  console.log(`Servidor activo en puerto ${config.PORT}`);
});
const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);

socketServer.on("connection", (client) => {
  console.log(
    `Cliente conectado, id ${client.id} desde ${client.handshake.address}`
  );
});
