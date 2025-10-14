import cron from "node-cron";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";

export const startOrderAutoCancel = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running auto-cancel for unpaid orders...");

    const now = new Date();
    const cutoff = new Date(now.getTime() - 15 * 60 * 1000);

    try {
      const unpaidOrders = await Order.find({
        status: "PENDING_PAYMENT",
        createdAt: { $lte: cutoff },
      });

      for (const order of unpaidOrders) {
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (!product) continue;
          product.reserved -= item.quantity;
          if (product.reserved < 0) product.reserved = 0;
          await product.save();
        }

        order.status = "CANCELLED";
        await order.save();

        console.log(`Order ${order._id} cancelled and stock released.`);
      }
    } catch (error) {
      console.error("Error in auto-cancel cron:", error);
    }
  });
};
