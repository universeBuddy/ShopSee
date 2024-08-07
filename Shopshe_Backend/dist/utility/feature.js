import mongoose from "mongoose";
import { nodeCache } from "../app.js";
import { Product } from "../models/ptoduct.js";
export const connectDB = (URI) => {
    mongoose
        .connect(URI, {
        dbName: "Shopshe_v1",
    })
        .then((c) => console.log(`MongoDb Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKey = [
            "latest-product",
            "categories",
            "all-product",
        ];
        if (typeof productId === "string") {
            productKey.push(`product-${productId}`);
        }
        if (typeof productId === "object") {
            productKey.forEach(i => productKey.push(`product-${productId}`));
        }
        nodeCache.del(productKey);
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `my-order-${userId}`,
            `order-${orderId}`,
        ];
        nodeCache.del(orderKeys);
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
