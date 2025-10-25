import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Not enough stock available" });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (newQty > product.stock)
        return res
          .status(400)
          .json({ message: "Cannot add more than available stock" });

      existingItem.quantity = newQty;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res
      .status(200)
      .json({
        message: "Item added to cart",
        data: await cart.populate("items.productId", "name price stock"),
      });
  } catch (error) {
    next(error);
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
