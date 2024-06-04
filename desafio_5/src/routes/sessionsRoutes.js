import { Router } from "express"; 

import config from "../config.js";
import usersManager from "../dao/users.manager.mdb.js"

const router = Router();

const manager = new usersManager();

const adminAuth = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin")
    // Si no existe el objeto req.session.user o el role no es admin
    return res
      .status(401)
      .send({
        origin: config.SERVER,
        payload:
          "Acceso no autorizado: se requiere autenticación y nivel de admin",
      });

    next();
};

router.get("/counter", async (req, res) => {
  try {
    // Si hay un counter en req.session, lo incrementamos, sino lo creamos con valor 1
    if (req.session.counter) {
      req.session.counter++;
      res
        .status(200)
        .send({
          origin: config.SERVER,
          payload: `Visitas: ${req.session.counter}`,
        });
    } else {
      req.session.counter = 1;
      res
        .status(200)
        .send({
          origin: config.SERVER,
          payload: "Bienvenido, es tu primer visita!",
        });
    }
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const result = await manager.credentialAreCorrect(email, password);
    
     if (!result.isValid) {
       return res
         .status(401)
         .send({ message: "Email o contraseña incorrectos" });
     }
    req.session.user = {
      firstName: result.firstName,
      lastName: result.lastName,
    };
    
    res.redirect("/profile"); 
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});


router.get("/private", adminAuth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ origin: config.SERVER, payload: "Bienvenido ADMIN!" });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

// Limpiamos los datos de sesión
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err)return res.status(500).send({ origin: config.SERVER, payload: "Error al ejecutar logout", error: err});
      res.redirect('/login');
      
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});


router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const result = await manager.Aggregated(req.body);

    if (result === "El email ya está registrado.") {
      return res.status(400).send({ message: result });
    }
    req.session.user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    res.redirect("/profile");
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

export default router;
