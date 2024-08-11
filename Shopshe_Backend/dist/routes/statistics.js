import express from "express";
import { getBarChart, getDashStats, getLineChart, getPieChart, } from "../controllers/statistics.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// ! Root ===> /api/v1/dashboard
app.get("/stats", adminOnly, getDashStats);
app.get("/pie", adminOnly, getPieChart);
app.get("/bar", adminOnly, getBarChart);
app.get("/line", adminOnly, getLineChart);
export default app;
