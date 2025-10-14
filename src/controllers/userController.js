import User from "../models/UserModel.js";
import utility from "../utils/utility.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await utility.generatePassword(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });
    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: null });
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;

    const token = utility.generateToken(user);

    res.json({
      status: true,
      message: "Login successful",
      token,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
// kjlas
export default { register, login };
