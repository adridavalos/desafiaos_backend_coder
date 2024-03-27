class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct(product) {
    let productExistence = this.products.some(
      (item) => item.code === product.code
    );
    return productExistence
      ? console.log("Codigo repetido")
      : this.products.push({ ...product, id: this.generateUniqueId() });
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.filter((item) => item.id === id);
    return product.length > 0 ? product : console.log("Not found");
  }

  static currentId = 1;
  generateUniqueId() {
    const code = ProductManager.currentId;
    ProductManager.currentId = ProductManager.currentId + 1;
    return code;
  }
}

//testing
let instancia = new ProductManager();
instancia.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
instancia.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc124",
  stock: 25,
});
instancia.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

console.log(instancia.getProducts());
console.log(instancia.getProductById(0));
