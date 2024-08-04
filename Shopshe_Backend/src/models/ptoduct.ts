import mongoose from "mongoose";
import { trim } from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your Name"],
    },
    photo: {
      type: String,
      required: [true, "Please Upload the Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter the Price"],
    },
    category: {
      type: String,
      required: [true, "Please Enter the Category"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Please Update the Stock"],
    },
  },

  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
