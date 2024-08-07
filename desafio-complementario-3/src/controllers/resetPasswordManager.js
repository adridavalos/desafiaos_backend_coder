import resetModel from '../models/passwordChangeTry.model.js';

class RecetManager {
  constructor() {}
  add = async (newData) => {
    try {
      return await resetModel.create(newData);
    } catch (err) {
      return err.message;
    }
  };

}

export default  RecetManager;
