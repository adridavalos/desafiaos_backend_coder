import fs from "fs";

class ProductManager {
  constructor(route) {
    this.products = [];
    this.path = route;
  }
  addProduct(product) {
    this.products = this.recoverProduct();
    let productExistence = this.products.some(
      (item) => item.code === product.code
    );
    if (productExistence) {
      return console.log("Codigo repetido");
    } else {
      this.products.push({ ...product, id: this.generateUniqueId() });
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
  }

  getProducts() {
    return this.recoverProduct();
  }

  getProductById(id) {
    const product = this.recoverProduct().filter((item) => item.id === id);
    return product.length > 0 ? product : console.log("Not found");
  }

  updateProduct(id, campos) {
    this.products = this.recoverProduct();
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
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
  }
  deleteProduct(id) {
    this.products = this.recoverProduct();

    if (this.getProductById(id)) {
      let productsFiltered = this.products.filter(
        (product) => product.id !== id
      );
      fs.writeFileSync(this.path, JSON.stringify(productsFiltered));
    } else {
      console.log("Not found");
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

  recoverProduct() {
    let products = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(products);
  }
}

let instancia = new ProductManager("./products.json");

// instancia.addProduct({
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 201,
//   thumbnail: "Sin imagen",
//   code: "abc124",
//   stock: 26,
// });
// instancia.addProduct({
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 202,
//   thumbnail: "Sin imagen",
//   code: "abc125",
//   stock: 27,
// });
// instancia.addProduct({
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc123",
//   stock: 25,
// });
//instancia.updateProduct(1, { title: "producto modificado", code: "abc128" });
instancia.deleteProduct(16);
console.log(instancia.getProducts());
//console.log(instancia.getProductById(4));
