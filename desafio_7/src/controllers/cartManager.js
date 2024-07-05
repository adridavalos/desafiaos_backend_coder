import mongoose from "mongoose";
import cartsModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

//FILE SYSTEM
import fs from "fs";

class cartManager {
  constructor() {}
  async addCart(userId) {
    try {
      await cartsModel.create({ _user_id: userId, products: [] });
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel
        .findById(id)
        .populate({ path: "products.product", model: productModel })
        .lean();
      if (cart) {
        return cart;
      } else {
        throw new Error("carrito no encontrado");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async getCartByUsuId(uid) {
    try {
      const cart = await cartsModel.findOne({ _user_id: uid });
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito por ID de usuario:', error);
      throw error;
    }
  }
    
  async addToCartId(cid, pid, quantity) {
    try {
      // Obtener el carrito por su ID
      const cart = await this.getCartById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      console.log((typeof(pid)));
      console.log(cart.products);
      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      console.log(productIndex);

      if (productIndex !== -1) {
        // Si el producto ya existe en el carrito, incrementar la cantidad
        cart.products[productIndex].quantity += quantity;
      } else {
        // Si el producto no existe en el carrito, agregarlo
        cart.products.push({ product: pid, quantity: quantity });
      }
      // Guardar los cambios en el carrito
      await cartsModel.updateOne({ _id: cid }, { products: cart.products });
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async deleteProductSelection(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productObjectId = new mongoose.Types.ObjectId(pid);
      const productIndex = cart.products.findIndex((product) =>
        product.product.equals(productObjectId)
      );

      if (productIndex !== -1) {
        const result = await cartsModel.updateOne(
          { _id: cid },
          { $pull: { products: { product: productObjectId } } }
        );

        if (result.nModified === 0) {
          throw new Error(
            "El producto no está en el carrito o el carrito no existe"
          );
        }

        console.log("Producto eliminado del carrito:", result);
        return result;
      } else {
        throw new Error("El producto no está en el carrito");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async vaciarCarrito(cid) {
    try {
      const result = await cartsModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );

      if (result.nModified === 0) {
        throw new Error("El carrito no existe o ya está vacío");
      }

      console.log("Carrito vaciado:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async actualizarCantidadProductos(cid, pid, quantity) {
    try {
      const productObjectId = new mongoose.Types.ObjectId(pid);

      const result = await cartsModel.updateOne(
        { _id: cid, "products.product": productObjectId },
        { $set: { "products.$.quantity": quantity } }
      );

      if (result.nModified === 0) {
        throw new Error(
          "El producto no está en el carrito o el carrito no existe"
        );
      }

      console.log("Cantidad del producto actualizada:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

export default cartManager;
