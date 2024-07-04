import { Router } from "express"; 
import passport from "passport";

import config from "../config.js";
import usersManager from "../controllers/users.manager.mdb.js"
import { verifyRequiredBody } from "../services/utils.js";
import initAuthStrategies from "../auth/passport.strategies.js";
import cartManager from "../controllers/cartManager.js"

const router = Router();

const manager = new usersManager();
const cartsManager = new cartManager();

initAuthStrategies();

const adminAuth = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin")
    // Si no existe el objeto req.session.user o el role no es admin
    return res
      .status(403)
      .send({
        origin: config.SERVER,
        payload:
          "Acceso no autorizado: se requiere autenticación y nivel de admin",
      });

    next();
};
const verifyAuthorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .send({ origin: config.SERVER, payload: "Usuario no autenticado" });
    if (req.user.role !== role)
      return res
        .status(403)
        .send({
          origin: config.SERVER,
          payload: "No tiene permisos para acceder al recurso",
        });

    next();
  };
};
const handlePolicies = (policies)=>{
  return async (req,res,next)=>{

  }
}
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

router.post( "/login", verifyRequiredBody(["email", "password"]),passport.authenticate("login", {failureRedirect: `/login?error=${encodeURI("Usuario o clave no válidos")}`,}),async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save((err) => {
          if (err)
            return res
              .status(500)
              .send({
                origin: config.SERVER,
                payload: null,
                error: err.message,
              });

          res.redirect("/profile");
        });
    } catch (err) {
      res
        .status(500)
        .send({ origin: config.SERVER, payload: null, error: err.message });
    }
  }
);
router.get("/ghlogin",passport.authenticate("ghlogin", { scope: ["user"] }),async (req, res) => {}
);

router.get("/ghlogincallback",passport.authenticate("ghlogin", {failureRedirect: `/login?error=${encodeURI("Error al identificar con Github")}`,}),async (req, res) => {  
  try {
      req.session.user = req.user;
      req.session.save((err) => {
        if (err)
          return res
            .status(500)
            .send({ origin: config.SERVER, payload: null, error: err.message });

        res.redirect("/profile");
      });
    } catch (err) {
      res
        .status(500)
        .send({ origin: config.SERVER, payload: null, error: err.message });
    }
  }
);

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


router.post("/register",verifyRequiredBody(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const result = await manager.Aggregated(req.body);

    if (result === "El email ya está registrado.") {
      return res.status(400).send({ message: result });
    }
    cartsManager.addCart(result._id.toHexString());
    req.session.user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      _id: result._id.toHexString(),
    };
    req.session.save((err) => {
        if (err)
          return res
            .status(500)
            .send({ origin: config.SERVER, payload: null, error: err.message });

        res.redirect("/profile");
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.get('/admin', verifyAuthorization('admin'), async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;
