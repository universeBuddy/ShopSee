import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utility/feature.js";
import { errorMiddleWare } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/orders.js";
// & DOTENV=
config({
    path: "./.env",
});
console.log(process.env.PORT);
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI || "";
connectDB(mongo_uri);
const app = express();
// * implement the node cache
export const nodeCache = new NodeCache();
// * middleware use for json
app.use(express.json());
// ! morgen used for moniter the requests
app.use(morgan("dev"));
app.get("/", (req, res) => {
    res.status(200).send("API Working");
});
// * Using Route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/upload", express.static("upload"));
// * Error Middle ware
app.use(errorMiddleWare);
app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
});
