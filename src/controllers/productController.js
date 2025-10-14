import Product from "../models/ProductModel.js";

const createProduct = async (req, res) => {
  try {
    const bodyData = req.body;
    const product = await Product.create(bodyData);
    res
      .status(201)
      .json({ status: true, message: "Product created", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server Error", data: null });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const bodyData = req.body;
    const product = await Product.findByIdAndUpdate(id, bodyData, {
      new: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    res.json({ status: true, message: "Product updated", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server Error", data: null });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    res.json({ status: true, message: "Product deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server Error", data: null });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc",
      name,
    } = req.query;
    const filter = name ? { name: { $regex: name, $options: "i" } } : {};

    const products = await Product.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      status: true,
      message: "Products fetched",
      data: { total, products },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server Error", data: null });
  }
};
export default { createProduct, updateProduct, deleteProduct, getProducts };
