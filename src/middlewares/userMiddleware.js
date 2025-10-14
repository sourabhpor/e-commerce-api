import User from "../models/UserModel.js";
import utility from "../utils/utility.js";

const checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required", data: null });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists", data: null });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: null });
  }
};

const checkLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    const isMatch = await utility.comparePasswords(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
export default { checkEmailExists, checkLogin };
