import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/ptoduct.js";
import ErrorHandler from "../utility/utility-class.js";
import { rm } from "fs";
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
export const getlatestProduct = TryCatch(async (req, res, next) => {
    const product = await Product.find({}).sort({ ceratedAt: -1 }).limit(5);
    return res.status(200).json({
        success: true,
        product,
    });
});
