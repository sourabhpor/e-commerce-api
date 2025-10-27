import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import Cart from "../models/CartModel.js";
import mongoose from "mongoose";
import { sendConfirmationEmail } from "../utils/sendEmail.js";

const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, totalAmount } = req.body;
    const userId = req.user._id;

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session
    );

    if (products.length !== items.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: false,
        message: "One or more products are invalid.",
      });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = products.find((p) => p._id.toString() === item.productId);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          status: false,
          message: "Invalid product in cart.",
        });
      }

      if (product.stock - product.reserved < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          status: false,
          message: `Not enough stock for product ${product.name}`,
        });
      }

      calculatedTotal += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      product.reserved += item.quantity;
      await product.save({ session });
    }

    if (calculatedTotal !== totalAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: false,
        message: "Total amount mismatch.",
      });
    }

    const newOrder = await Order.create(
      [
        {
          userId,
          items: orderItems,
          totalAmount: calculatedTotal,
          status: "PENDING_PAYMENT",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { session }
    );

    await Cart.deleteMany({ userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    setTimeout(async () => {
      try {
        const orderCheck = await Order.findById(newOrder[0]._id);
        if (orderCheck && orderCheck.status === "PENDING_PAYMENT") {
          orderCheck.status = "CANCELLED";
          await orderCheck.save();

          for (const item of orderCheck.items) {
            const product = await Product.findById(item.productId);
            if (product) {
              product.reserved = Math.max(0, product.reserved - item.quantity);
              await product.save();
            }
          }
        }
      } catch (err) {
        console.error("Auto-cancel failed:", err.message);
      }
    }, 15 * 60 * 1000);

    return res.status(201).json({
      status: true,
      message: "Order placed successfully. Stock reserved.",
      data: newOrder[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error during checkout." });
  }
};

const payOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("userId", "email name");

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    if (order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized",
      });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        continue;
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: false,
          message: `Not enough stock for product ${product.name}`,
        });
      }
      product.stock -= item.quantity;
      product.reserved = Math.max(0, product.reserved - item.quantity);
      await product.save();
    }

    order.status = "PAID";
    await order.save();

    await sendConfirmationEmail(order.userId.email, order);

    return res.status(200).json({
      status: true,
      message: "Payment successful. Order confirmed and email sent.",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Server error during payment.",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId })
      .populate("items.productId", "name price")
      .sort({ _id: -1 });

    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching orders.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate(
      "items.productId",
      "name price"
    );

    if (!order)
      return res.status(404).json({
        status: false,
        message: "Order not found.",
      });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Order details fetched.",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching order.",
    });
  }
};

export default { checkout, payOrder, getOrders, getOrderById };
