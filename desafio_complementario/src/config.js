import * as url from "url";
export const config = {
  SERVER:'ATLAS',
  PORT: 5000,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  // Esta función tipo getter nos permite configurar dinámicamente
  // la propiedad UPLOAD_DIR en base al valor de otra propiedad (DIRNAME)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  }, // Función getter
  //MONGODB_URI: "mongodb://127.0.0.1:27017/coder_53160", LOCALLLLL
  MONGODB_URI: "mongodb+srv://ecommerce_53160:ecommerceCoder2024@clustercoder.2dbntrt.mongodb.net/ecommerce",
};
