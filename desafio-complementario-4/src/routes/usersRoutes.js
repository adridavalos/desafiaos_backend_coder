import { Router } from "express";
import usersManager from "../controllers/users.manager.mdb.js";
import { uploader } from "../services/uploader.js";
const router = Router();
const User = new usersManager();

router.put('/:uid', async(req,res)=>{
    const { uid } = req.params;

    try {
        const user = await User.getById(uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const newRole = user.role === 'user' ? 'premium' : 'user';

        const result = await User.update(
            { _id: uid },
            { role: newRole },
            { new: true }
        );
        res.status(200).json({ message: `Rol cambiado a ${newRole}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al cambiar el rol del usuario', error });
    }

});
router.post('/:uid/documents', uploader.array('documents', 3), async(req,res)=>{
    console.log(req.files);
    res.status(200).send({ status: 'OK', payload: 'Imágenes subidas', files: req.files });

});
export default router;