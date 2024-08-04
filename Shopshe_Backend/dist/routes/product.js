import express from "express";
import { newProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { getlatestProduct } from "../controllers/product.js";
const app = express.Router();
// * create a New Product
app.post("/new", adminOnly, singleUpload, newProduct);
// * update a Product
app.get("/latest", getlatestProduct);
// * category route
export default app;
