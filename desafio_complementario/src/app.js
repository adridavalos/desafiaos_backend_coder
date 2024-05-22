import express from "express";
import handlebars from "express-handlebars"
import mongoose from "mongoose";
import initSocket from "./sockets.js";

import { config } from "./config.js";
import viewsRouter from "./routes/views-routes.js"
import productsRoute from "./routes/products-routes.js";

const app = express();

const expressInstance = app.listen(config.PORT, async()=>{

    await mongoose.connect(config.MONGODB_URI);

    const socketServer = initSocket(expressInstance);
    app.set("socketServer", socketServer);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/static", express.static(`${config.DIRNAME}/public`));

    app.use("/api/products", productsRoute);
    app.use("/", viewsRouter);

    app.engine("handlebars", handlebars.engine());
    app.set("views", `${config.DIRNAME}/views`);
    app.set("view engine", "handlebars");


    console.log(`App activa en puerto ${config.PORT} conectada a bbdd ${config.SERVER}`);
});