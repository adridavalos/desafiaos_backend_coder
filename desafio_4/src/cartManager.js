import { log } from "console";
import fs from "fs";

class cartManager {
  constructor(route) {
    this.carts = [];
    this.path = route;
  }
  async addCart() {
    try {
      this.carts = await this.recoverCart();
      const id = this.generateUniqueId();
      this.carts.push({ products: [], id });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts),
        "utf-8"
      );
      return id;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const data = await this.recoverCart();
      const product = data.find((item) => item.id === id);
      if (product) {
        return product;
      } else {
        throw new Error("carrito no encontrado");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async addToCartId(cid, pid, quantity) {
    try {
      this.carts = await this.recoverCart();

      const cart = this.carts.find((cart) => cart.id === cid);
      if (!cart) {
        throw new Error("carrito no encontrado");
      }
      const product = cart.products.find((product) => product.product === pid);
      if (product) {
        product.quantity = product.quantity + quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts),
        "utf-8"
      );
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  generateUniqueId() {
    let max = 0;
    if (this.carts.length) {
      this.carts.forEach((element) => {
        if (max < element.id);
        max = element.id;
      });
    }
    return max + 1;
  }
  async recoverCart() {
    try {
      let carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

export default cartManager;
