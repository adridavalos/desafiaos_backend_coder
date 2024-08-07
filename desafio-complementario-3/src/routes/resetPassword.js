import { Router } from "express";
import resetPassword from '../models/passwordChangeTry.model.js'

const router = Router();

router.get("/request-email" ,async(req,res)=>{
    res.render('passwordReset', {});
  });
  
router.post("/email", async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await manager.getOne({ email });
      console.log(user);
  
      if (user) {
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
        res.render('resetEmailSent', {
          message: 'Se ha enviado un correo electrónico para la recuperación de contraseña. Revisa tu bandeja de entrada.'
        });
      } else {
        res.render('resetEmailSent', {
          message: 'No se encontró ningún usuario con ese correo electrónico.'
        });
      }
    } catch (err) {
      res.status(500).send({ status: 'Err', data: err.message });
    }
});

  export default router;