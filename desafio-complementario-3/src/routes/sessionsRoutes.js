import { Router } from "express"; 
import passport from "passport";

import nodemailer from 'nodemailer'
import config from "../config.js";
import usersManager from "../controllers/users.manager.mdb.js"
import { verifyRequiredBody, handlePolicies } from "../services/utils.js";
import initAuthStrategies from "../auth/passport.strategies.js";
import cartManager from "../controllers/cartManager.js"

const router = Router();

const manager = new usersManager();
const cartsManager = new cartManager();

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
      user: config.GMAIL_APP_USER,
      pass: config.GMAIL_APP_PASS
  }
});

initAuthStrategies();


router.post("/login",verifyRequiredBody(["email", "password"]),
  passport.authenticate('login', {failureRedirect: `/login?error=${encodeURI("Usuario o clave no válidos")}`}),
  async (req, res) => {
    try { 
      req.session.user = req.user;
      req.session.save((err) => {
        if (err) {
          return res
            .status(500)
            .send({
              origin: config.SERVER,
              payload: null,
              error: err.message,
            });
        }
        if (req.user.role === 'admin') {
          res.redirect("/realtimeproducts");
        } else {
          res.redirect("/products");
        }
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

router.get("/ghlogincallback", passport.authenticate("ghlogin", { failureRedirect: `/login?error=${encodeURI("Error al identificar con Github")}` }), async (req, res) => {  
  try {
    req.session.user = req.user;
    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .send({ origin: config.SERVER, payload: null, error: err.message });
      }

      // Redireccionar según el rol del usuario
      if (req.user.role === 'admin') {
        res.redirect("/realtimeproducts");
      } else {
        res.redirect("/products");
      }
    });
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


router.post("/register", verifyRequiredBody(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
  try {
    const result = await manager.Aggregated(req.body);

    if (result === "El email ya está registrado.") {
      return res.status(400).send({ message: result });
    }

    await cartsManager.addCart(result._id.toHexString()); 
    req.session.user = result;
    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .send({ origin: config.SERVER, payload: null, error: err.message });
      }

      // Redirigir según el rol del usuario
      if (result.role === 'admin') {
        res.redirect("/realtimeproducts");
      } else {
        res.redirect("/products");
      }
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.get('/email', async (req, res) => {
  try {
    const confirmation = await transport.sendMail({
      from: `Sistema Coder <${config.GMAIL_APP_USER}>`,
      to: 'adavalos654@gmail.com',
      subject: 'Modificar contraseña',
      html: `
        <h1>Ecommerce</h1>
        <p>Haz clic en el siguiente botón para modificar tu contraseña:</p>
        <a href="http://localhost:8080/reset-password" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          Modificar Contraseña
        </a>`
    });
    res.render('resetEmailSent', { message: 'Se ha enviado un correo electrónico para la recuperación de contraseña. Revisa tu bandeja de entrada.' });
  } catch (err) {
    res.status(500).send({ status: 'Err', data: err.message });
  }
});
router.put('/update', async(req,res)=>{
  try {
    const datosAModificar = req.body;

    
  } catch (err) {
    res.status(500).send({ status: 'Error', message: err.message });
  }
})


export default router;
