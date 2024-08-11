import { cpuUsage } from "process";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utility/utility-class.js";
import {paymentIntent} from "../app.js"
import Razorpay from "razorpay";





// * creating a new payment
export const createPayment = TryCatch(async (req, res, next) => {
  const {  amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please enter ammount", 400));
  }


 const option = {
  amount:5000,
  currency:"INR",
  receipt:"order_recptid_11"
 };

 const order = await paymentIntent.orders.create(option)

  return res.status(201).json({
    success: true,
   order,
  });
});











// * creating a new coupon
export const createCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount) {
    return next(new ErrorHandler("Please enter both coupon and ammount", 400));
  }
  await Coupon.create({ code: coupon, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`,
  });
});

// * creating a discount

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.body;

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) {
    return next(new ErrorHandler("Invalid Coupon code", 400));
  }

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find();

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupons = await Coupon.findByIdAndDelete(id);

  if(!coupons){
    return next(new ErrorHandler("Invalid Coupon ID",400));
  }
  return res.status(200).json({
    success: true,
    message: `Coupon ${coupons?.code}Deleted Sucessfully`,
  });
});
