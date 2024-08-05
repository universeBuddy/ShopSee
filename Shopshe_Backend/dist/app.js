import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utility/feature.js";
import { errorMiddleWare } from "./middlewares/error.js";
import NodeCache from "node-cache";
// * product route : ==================
import productRoute from "./routes/product.js";
const PORT = 3000;
const app = express();
connectDB();
// * implement the node cache
export const nodeCache = new NodeCache();
// * middleware use for json
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("API Working");
});
// * Using Route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/upload", express.static("upload"));
// * Error Middle ware
app.use(errorMiddleWare);
app.listen(PORT, () => {
    console.log(`Express is working on http://localhost:${PORT}`);
});
