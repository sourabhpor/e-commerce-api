import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { startOrderAutoCancel } from "./utils/orderCron.js";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();
connectDB();
startOrderAutoCancel();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
