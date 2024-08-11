import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/ptoduct.js";
import { randomUUID } from "crypto";
import { Order } from "../models/order.js";
import { types } from "util";

export const connectDB = (URI: string) => {
  mongoose
    .connect(URI, {
      dbName: "Shopshe_v1",
    })
    .then((c) => console.log(`MongoDb Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache =  ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKey: string[] = [
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
    const orderKeys: string[] = [
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

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];

    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) {
    return thisMonth * 100;
  }
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventory = async ({
  categories,
  productCount,
}: {
  categories: string[];
  productCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productCount) * 100),
    });
  });
  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount: number;
  total: number;
}

type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps): number[] => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;

    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff >= 0 && monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property]! : 1;
    }

    console.log(typeof docArr); // Should be 'object'
    console.log(docArr instanceof Array); // Should be true
    console.log(docArr[0] instanceof Date); // Should be true for docArr[0].createdAt
  });
  return data;
};
