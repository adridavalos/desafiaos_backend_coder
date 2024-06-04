
import path from "path";
const config = {
  PORT: 8080,
  DIRNAME: path.dirname(
    new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")
  ), // Win
  // Esta función tipo getter nos permite configurar dinámicamente
  // la propiedad UPLOAD_DIR en base al valor de otra propiedad (DIRNAME)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  }, // Función getter
  MONGODB_URI:
    "mongodb+srv://ecommerce_53160:ecommerceCoder2024@clustercoder.2dbntrt.mongodb.net/ecommerce",
  SECRET: "coder_53160_abc1118",
};
export default config;
