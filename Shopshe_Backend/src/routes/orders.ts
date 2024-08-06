
import  express  from "express";
import { newOrder } from "../controllers/order.js";




const app = express.Router();
 
// ! Root = >  ../api/v1/order/new 
// * creating User Route 
app.post("/new",newOrder);





export default app;
   