import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// ! Root = >  ../api/v1/order/new
// * creating a new user Order
app.post("/new", newOrder);

// * Creating User Order..
app.get("/my", myOrders);

// * get all User Order..
app.get("/all", adminOnly, allOrders);

// * Get the single Order
app.get("/:id", getSingleOrder);

// * update  Order
app.put("/:id",adminOnly, processOrder);

// * Delete the Order
app.delete("/:id",adminOnly, deleteOrder);

export default app;
