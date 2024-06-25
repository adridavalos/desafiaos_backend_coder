import express from "express";
import handlebars from "express-handlebars";
import mongoose from 'mongoose'
import session from 'express-session';
//import fileStore from 'session-file-store';
import MongoStore from "connect-mongo";
import passport from 'passport';

import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import viewRouter from "./routes/viewsRoutes.js";
import config from "./config.js";
import initSoket from "./sockets.js";
import sessionRouter from "./routes/sessionsRoutes.js";
import TestRouter from "./routes/testRouter.js";
const app = express();

const expressInstance = app.listen(config.PORT, async() => {
  await mongoose.connect(config.MONGODB_URI);

  const socketServer = initSoket(expressInstance);
  app.set("socketServer", socketServer); //referencia global

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Activamos el uso del módulo de sesiones para identificar usuarios

  /**
   * Agregamos persistencia al manejo de sesiones:
   *
   * session-file-store: almacenamiento en archivos (habilitar la línea fileStorage debajo)
   * connect-mongo: almacenamiento en colección MongoDB
   *
   * ttl = time to live (tiempo de vida de la sesión en segundos)
   */

  //const fileStorage = fileStore(session);
  app.use(
    session({
      //para persistencia en archivo
      //store: new fileStorage({ path: "./sessions", ttl: 100, retries: 0 }),
      //para mongo
      store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 15 }),
      secret: config.SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  // Solo inicializamos passport y el enlace a session
  app.use(passport.initialize());
  app.use(passport.session());

  app.engine("handlebars", handlebars.engine());
  app.set("views", `${config.DIRNAME}/views`);
  app.set("view engine", "handlebars");

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartRouter);
  app.use("/", viewRouter);
  app.use("/api/sessions", sessionRouter);
  app.use("/api/test",new TestRouter().getRouter());
  app.use("/static", express.static(`${config.DIRNAME}/public`));

  console.log(`Servidor activo en puerto ${config.PORT}`);
});