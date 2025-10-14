import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status.toUpperCase();
    }

    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error fetching orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["SHIPPED", "DELIVERED"];
    if (!validStatus.includes(status.toUpperCase())) {
      return res.status(400).json({
        status: false,
        message: "Invalid status. Only SHIPPED or DELIVERED allowed.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    order.status = status.toUpperCase();
    await order.save();

    res.status(200).json({
      status: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error updating order status",
    });
  }
};

export default { getAllOrders, updateOrderStatus };
