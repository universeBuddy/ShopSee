import express from "express";
import { allCoupons, applyDiscount, createCoupon, deleteCoupon, createPayment } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// * strpe payment
app.post("/create", createPayment);
// * creating discount
app.get("/discount", applyDiscount);
// * creating coupon
app.post("/coupon/new", adminOnly, createCoupon);
// * geet all coupon
app.get("/coupon/all", adminOnly, allCoupons);
// * delete coupon
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
