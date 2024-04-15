import fs from "fs";

class ProductManager {
  constructor(route) {
    this.products = [];
    this.path = route;
  }
  async addProduct(product) {
    try {
      this.products = await this.recoverProduct();
      let productExistence = this.products.some(
        (item) => item.code === product.code
      );
      if (productExistence) {
        return console.log(`Codigo repetido ${product.code}`);
      } else {
        this.products.push({ ...product, id: this.generateUniqueId() });
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products),
          "utf-8"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getProducts(limit) {
    try {
      const productos = await this.recoverProduct();
      return limit === 0 ? productos : productos.slice(0, limit);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const data = await this.recoverProduct();
      const product = data.find((item) => item.id === id);
      if (product) {
        return product;
      } else {
        console.log("Not found");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async updateProduct(id, campos) {
    try {
      this.products = await this.recoverProduct();
      let encontrado = false;
      for (const product of this.products) {
        if (product.id === id) {
          for (let key in campos) {
            if (key in product) {
              product[key] = campos[key];
            }
          }
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        console.log("Not found");
      } else {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products),
          "utf-8"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async deleteProduct(id) {
    try {
      this.products = await this.recoverProduct();

      if (await this.getProductById(id)) {
        let productsFiltered = this.products.filter(
          (product) => product.id !== id
        );
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(productsFiltered),
          "utf-8"
        );
      } else {
        console.log("ID INEXISTENTE");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  generateUniqueId() {
    let max = 0;
    if (this.products.length) {
      this.products.forEach((element) => {
        if (max < element.id);
        max = element.id;
      });
    }
    return max + 1;
  }

  async recoverProduct() {
    try {
      let products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

export default ProductManager;
