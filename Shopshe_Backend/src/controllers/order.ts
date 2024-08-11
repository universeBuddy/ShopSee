import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Request } from "express";
import { invalidateCache, reduceStock } from "../utility/feature.js";
import ErrorHandler from "../utility/utility-class.js";
import { nodeCache } from "../app.js";
// * ==================== create new order =============
export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
      return next(new ErrorHandler("Please Entee all Fields", 400));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    reduceStock(orderItems);

     invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(201).json({
      success: true,
      message: "Order Palced Successfully",
    });
  }
);
// *  ====================== get user order=================
export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = ` my-orders-${user}`;
  let orders = [];

  if (nodeCache.has(key)) {
    orders = JSON.parse(nodeCache.get(key) as string);
  } else {
    orders = await Order.find({ user });
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

// * =================== get all order ===================
export const allOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;
  let orders = [];

  if (nodeCache.has(key)) {
    orders = JSON.parse(nodeCache.get(key) as string);
  } else {
    orders = await Order.find().populate("user", "name");
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(201).json({
    success: true,
    orders,
  });
});

// * ====================== Get a single Order==========
export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `orders-${id}`;
  let order;

  if (nodeCache.has(key)) {
    order = JSON.parse(nodeCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) {
      return next(new ErrorHandler("Order not Found", 400));
    }
    nodeCache.set(key, JSON.stringify(order));
  }

  return res.status(201).json({
    success: true,
    order,
  });
});

// * ===========================Update Order =============
export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not Found", 404));
  }

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;

    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }
  await order.save();
   invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});
// * ========================= delete order===============
export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not Found", 404));
  }

  await order.deleteOne();
   invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
