import { TryCatch } from "../middlewares/error.js";
import { Request } from "express";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/ptoduct.js";
import ErrorHandler from "../utility/utility-class.js";
import { rm } from "fs";

// * Creating a funtion to  create New Product
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

// * craeting a funnction to get a  updated product
export const getlatestProduct = TryCatch(async (req, res, next) => {
  const product = await Product.find({}).sort({ ceratedAt: -1 }).limit(5);

  return res.status(200).json({
    success: true,
    product,
  });
});

// * creating a function to seach in the distinct category product

export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");
  return res.status(200).json({
    success: true,
    categories,
  });
});

// * craeting  a function to admin only access product
export const getAdminProduct = TryCatch(async (req, res, next) => {
  const product = await Product.find({});
  return res.status(200).json({
    success: true,
    product,
  });
});

// * craeting a function to get single product
export const getSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not Found!", 400));
  return res.status(200).json({
    success: true,
    product,
  });
});

// * craeting a function a updating product
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid ID", 400));

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

// * creating a function to delete a  product by ID
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not Found!", 400));

  rm(product.photo!, () => {
    console.log("Product Photo Deleted");
  });
  await Product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, price, category } = req.query;
    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    const skip = limit * (page - 1);

    const baseQuery: BaseQuery = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }
    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [product, filteredOnlyProduct] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.floor(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      product,
      totalPage,
    });
  }
);
