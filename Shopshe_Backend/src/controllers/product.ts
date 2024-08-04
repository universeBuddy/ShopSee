import { TryCatch } from "../middlewares/error.js";
import { Request } from "express";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/ptoduct.js";
import ErrorHandler from "../utility/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please Add Photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });

      return next(new ErrorHandler("Please Add All Field", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const getlatestProduct = TryCatch(async (req, res, next) => {
  const product = await Product.find({}).sort({ ceratedAt: -1 }).limit(5);

  return res.status(200).json({
    success: true,
    product,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");
  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProduct = TryCatch(async (req, res, next) => {
  const products = await Product.find({});
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const products = await Product.find({});
  return res.status(200).json({
    success: true,
    products,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {


  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid ID", 400));

  if (!photo) return next(new ErrorHandler("Please Add Photo", 400));

  if (photo) {
    rm(product.photo!, () => {
      console.log("recent photo Deleted");
    });

    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;


  await product.save();
  return res.status(201).json({
    success: true,
    message: "Product Updated Successfully",
  });
});
