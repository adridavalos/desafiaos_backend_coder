
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

  GITHUB_CLIENT_ID: "Iv23liLDVjLIEr6c3LXh",
  GITHUB_CLIENT_SECRET: "b89e1a4a70c0871f035123d4d308a5f80e0983fc",
  GITHUB_CALLBACK_URL: "http://localhost:8080/api/sessions/ghlogincallback",
};

export default config;
