import { TryCatch } from "../middlewares/error.js";
import { Request } from "express";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/ptoduct.js";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    await Product.create({
      name,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo?.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);
