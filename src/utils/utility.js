import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  const secretKey = process.env.JWT_SECRET;
  const options = {
    expiresIn: process.env.TOKEN_EXPIRE,
  };

  try {
    return sign(payload, secretKey, options);
  } catch (error) {
    throw new Error("Failed to generate token");
  }
};

const generatePassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePasswords = async (password, comparePassword) => {
  return bcrypt.compare(password, comparePassword);
};

export default { generateToken, generatePassword, comparePasswords };
