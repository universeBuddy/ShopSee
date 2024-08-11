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
export const invalidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
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
            productKey.forEach(() => productKey.push(`product-${productId}`));
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
        nodeCache.del([
            "admin-stats",
            "admin-pie-chart",
            "admin-bar-chart",
            "admin-line-chart",
        ]);
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
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0) {
        return thisMonth * 100;
    }
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventory = async ({ categories, productCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff >= 0 && monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property] : 1;
        }
        console.log(typeof docArr); // Should be 'object'
        console.log(docArr instanceof Array); // Should be true
        console.log(docArr[0] instanceof Date); // Should be true for docArr[0].createdAt
    });
    return data;
};
