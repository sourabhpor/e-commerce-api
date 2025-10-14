import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";

const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ status: false, message: "ProductId and quantity required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res
      .status(200)
      .json({ status: true, message: "Created Successfully", data: cart });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price"
    );
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res
      .status(200)
      .json({ status: true, message: "Retrieved Successfully", data: cart });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};

const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ status: true, data: cart });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};
export default { addItem, getCart, removeItem };
