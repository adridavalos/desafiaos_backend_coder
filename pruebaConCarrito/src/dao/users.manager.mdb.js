import usersModel from './models/users.model.js';
import { isValidPassword } from '../utils.js'; 
import {createHash} from '../utils.js';

class UsersManager {
  constructor() {}

  getAll = async (limit = 0) => {
    try {
      return limit === 0
        ? await usersModel.find().lean()
        : await usersModel.find().limit(limit).lean();
    } catch (err) {
      return err.message;
    }
  };

  getById = async (id) => {
    try {
      return await usersModel.findById(id).lean();
    } catch (err) {
      return err.message;
    }
  };

  Aggregated = async (newUser) => {
    try {
      // Verifica si el email ya existe en la base de datos
      const existingUser = await usersModel.findOne({ email: newUser.email });

      if (existingUser) {
        // Si el email ya existe, devuelve un mensaje de error
        return "El email ya está registrado.";
      }
      newUser.password = createHash(newUser.password);
      // Si el email no existe, crea el nuevo usuario
      const datosUsu = await usersModel.create(newUser);
      
      return datosUsu;
    } catch (err) {
      return err.message;
    }
  };
  credentialAreCorrect = async (email, password) => {
    try {
      const user = await usersModel.findOne({ email: email });

      if (!user) {
        return { isValid: false };
      }

      const isMatch = isValidPassword(user.password, password);

      if (isMatch) {
        return {
          isValid: true,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
        };
      } else {
        return { isValid: false };
      }
    } catch (err) {
      console.error(err);
      return { isValid: false };
    }
  };

  getOne = async (filter) => {
    try {
      return await usersModel.findOne(filter).lean();
    } catch (err) {
      return err.message;
    }
  };

  getPaginated = async (filter, options) => {
    try {
      return await usersModel.paginate(filter, options);
    } catch (err) {
      return err.message;
    }
  };

  add = async (newData) => {
    try {
      return await usersModel.create(newData);
    } catch (err) {
      return err.message;
    }
  };

  update = async (filter, update, options) => {
    try {
      return await usersModel.findOneAndUpdate(filter, update, options);
    } catch (err) {
      return err.message;
    }
  };

  delete = async (filter) => {
    try {
      return await usersModel.findOneAndDelete(filter);
    } catch (err) {
      return err.message;
    }
  };
}

export default UsersManager;
