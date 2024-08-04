import express from "express";
import { newUser, getUsers, deleteUser, getAllUsers } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// * creating User Route 
app.post("/new", newUser);
// * Get all user
app.get("/all", adminOnly, getAllUsers);
// * Get a single user 
app.get("/:id", adminOnly, getUsers);
// * Delete User Route
app.delete("/:id", adminOnly, deleteUser);
export default app;
