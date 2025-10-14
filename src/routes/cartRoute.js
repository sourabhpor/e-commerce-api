import express from "express";
import controllers from "../controllers/index.js";
import validations from "../validations/index.js";
import middlewares from "../middlewares/index.js";

const { cartController } = controllers;
const { cartValidation } = validations;
const { validate, authMiddleware } = middlewares;

const router = express.Router();

router.get("/", authMiddleware, cartController.getCart);
router.post(
  "/items",
  authMiddleware,
  validate(cartValidation.addItemValidation),
  cartController.addItem
);
router.delete("/items/:productId", authMiddleware, cartController.removeItem);

export default router;
