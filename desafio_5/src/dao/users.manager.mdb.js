import usersModel from './models/users.model.js';

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
            return 'El email ya está registrado.';
            }

            // Si el email no existe, crea el nuevo usuario
            return await usersModel.create(newUser);
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

            const isMatch = user.password === password;

            if (isMatch) {
                return { isValid: true, firstName: user.firstName, lastName: user.lastName };
            } else {
                return { isValid: false };
            }
        } catch (err) {
            console.error(err);
            return { isValid: false };
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
