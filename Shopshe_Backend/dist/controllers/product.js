import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/ptoduct.js";
import ErrorHandler from "../utility/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { nodeCache } from "../app.js";
// * Creating a funtion to  create New Product
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please Add Photo", 400));
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
});
// * craeting a funnction to get a  updated product
export const getlatestProduct = TryCatch(async (req, res, next) => {
    let product = [];
    // ! implement the chaching
    if (nodeCache.has("latest-product")) {
        product = JSON.parse(nodeCache.get("latest-product"));
    }
    else {
        product = await Product.find({}).sort({ ceratedAt: -1 }).limit(5);
        nodeCache.set("letest-product", JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
// * creating a function to seach in the distinct category product
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    // ! if cache have data the pase it
    if (nodeCache.has("categories")) {
        categories = JSON.parse(nodeCache.get("categories"));
    }
    else {
        // ! if cache have not the data then retrive from the mongoDB and pase the user and after that store it on the cache (for next time).
        categories = await Product.distinct("category");
        nodeCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
// * craeting  a function to admin only access product
export const getAdminProduct = TryCatch(async (req, res, next) => {
    let product;
    if (nodeCache.has("all-product")) {
        product = JSON.parse(nodeCache.get("all-product"));
    }
    else {
        product = await Product.find({});
        nodeCache.set("all-product", JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
// * craeting a function to get single product
export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (nodeCache.has(`product-${id}`)) {
        product = JSON.parse(nodeCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product not Found!", 400));
        nodeCache.set(`product-${id}`, JSON.stringify(product));
    }
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
    if (!product)
        return next(new ErrorHandler("Invalid ID", 400));
    if (photo) {
        rm(product.photo, () => {
            console.log("recent photo Deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(201).json({
        success: true,
        message: "Product Updated Successfully",
    });
});
// * creating a function to delete a  product by ID
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not Found!", 400));
    rm(product.photo, () => {
        console.log("Product Photo Deleted");
    });
    await Product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Product deleted Successfully",
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, price, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
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
    if (category)
        baseQuery.category = category;
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
});
// ^ to genrate the fake data for database
const genrateRandomProduct = async (count = 10) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        const product = {
            name: faker.commerce.productName(),
            photo: "uploads/9d30c711-9a26-4c21-9f66-3eac525d6b05.jpeg",
            price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
            stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
            category: faker.commerce.department(),
            createdAt: new Date(faker.date.past()),
            updtatedAt: new Date(faker.date.recent()),
            __v: 0,
        };
        products.push(product);
    }
    await Product.create(products);
    console.log({ success: true });
};
// ^ to delete all product.
const deleteRandomProduct = async (count = 10) => {
    const products = await Product.find({}).skip(2);
    for (let i = 0; i < count; i++) {
        const product = products[i];
        await product.deleteOne();
    }
    console.log({ success: true });
};
