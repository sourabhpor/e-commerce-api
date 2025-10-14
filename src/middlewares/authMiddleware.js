import pkg from "jsonwebtoken";
const { verify } = pkg;
import User from "../models/UserModel.js";

const authentication = async (req, res, next) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = req.headers.authorization;

    const tokens = token.split(" ");
    if (!tokens[0] || tokens[0] !== "Bearer") {
      return res
        .status(401)
        .json({ status: false, message: "Token not provided", data: null });
    } else {
      if (!tokens[1]) {
        return res
          .status(401)
          .json({ status: false, message: "Token not provided", data: null });
      } else {
        const decoded = verify(tokens[1], jwtSecretKey);
        if (!decoded) {
          return res
            .status(401)
            .json({ status: false, message: "Invalid token", data: null });
        } else {
          const user = await User.findById(decoded.userId);
          if (!user) {
            return res
              .status(401)
              .json({ status: false, message: "Invalid user", data: null });
          } else {
            req.user = user;
            next();
          }
        }
      }
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Token Expire!", data: null });
  }
};

export default authentication;
