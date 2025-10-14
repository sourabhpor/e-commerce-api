import express from "express";
import controllers from "../controllers/index.js";
import validations from "../validations/index.js";
import middlewares from "../middlewares/index.js";
const { uservalidation } = validations;
const { userController } = controllers;
const { validate, userMiddleware } = middlewares;
const router = express.Router();

// Register route
router.post(
  "/register",
  validate(uservalidation.registerValidation),
  userMiddleware.checkEmailExists,
  userController.register
);

// Login route
router.post(
  "/login",
  validate(uservalidation.loginValidation),
  userMiddleware.checkLogin,
  userController.login
);

export default router;
