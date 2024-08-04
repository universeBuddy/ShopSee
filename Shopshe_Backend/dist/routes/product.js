import express from "express";
import { newProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// * create a New Product 
app.post("/new", singleUpload, newProduct);
export default app;
