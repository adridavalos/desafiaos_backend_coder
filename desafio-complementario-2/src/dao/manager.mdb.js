import productsModel from "./models/products.model.js"
class CollectionManager {
    constructor() {
    }

    getAll = async (limit) => {
        try {
             return limit === 0
               ? await productsModel.find().lean()
               : await productsModel.find().lean().limit(limit);
           ;
        } catch (err) {
            return err.message;
        };
    };

    add = async (newData) => {
        try {
             await productsModel.create(newData);
        } catch (err) {
            return err.message;
        };
    };
    getById = async (id) => {
        try {
            await productsModel.findById(id).lean();
        } catch (err) {
            return err.message;
        };
    };

    update = async (id, updProd) => {
        try {
                const filter = { _id: id };            
                const options = { new: true };
                const process = await productsModel.findOneAndUpdate(
                    filter,
                    updProd,
                    options
                );
        } catch (err) {
            return err.message;
        };
    };

    delete = async (idDelete) => {
        try {
            const filter = { _id: idDelete };
            const process = await productsModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };
}

export default CollectionManager;