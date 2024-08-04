import express from "express";
import { newProduct, updateProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { getAllCategories } from "../controllers/product.js";
import { getlatestProduct } from "../controllers/product.js";
import { getAdminProduct } from "../controllers/product.js";
import { getSingleProduct } from "../controllers/product.js";
const app = express.Router();
// ! Root => http://api/v1/product
// * create a New Product
app.post("/new", adminOnly, singleUpload, newProduct);
// * update a Product
app.get("/latest", getlatestProduct);
// * category route
app.get("/categories", getAllCategories);
// * admin access product
app.get("/admin-products", getAdminProduct);
app.route(":/id").get(getSingleProduct, updateProduct).put(singleUpload);
export default app;
