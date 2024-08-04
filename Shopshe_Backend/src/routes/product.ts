import express from "express";
import { deleteProduct, newProduct, updateProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { getAllCategories } from "../controllers/product.js";
import { getlatestProduct } from "../controllers/product.js";
import { getAdminProduct } from "../controllers/product.js";
import { getSingleProduct } from "../controllers/product.js";
import { getAllProducts } from "../controllers/product.js";


const app = express.Router();

 // ! Root => http://api/v1/product

// * create a New Product
app.post("/new", adminOnly, singleUpload, newProduct);

app.get("/all" ,getAllProducts)
 
// * get updated  Product
app.get("/latest", getlatestProduct);

// * category route
app.get("/categories", getAllCategories);

// * admin access product
app.get("/admin-products", adminOnly,getAdminProduct);


// * get Single Product 
app.get("/:id", getSingleProduct);

// * update single PRoduct
app.put("/:id", adminOnly,singleUpload,updateProduct);

// * delete single product
app.delete("/:id",adminOnly,deleteProduct);
 

export default app;  
