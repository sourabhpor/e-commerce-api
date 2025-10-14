import express from "express";
import controllers from "../controllers/index.js";
import validations from "../validations/index.js";
import middlewares from "../middlewares/index.js";

const { orderController } = controllers;
const { orderValidation } = validations;
const { validate, authMiddleware, adminMiddleware } = middlewares;

const router = express.Router();

router.post(
  "/checkout",
  authMiddleware,
  adminMiddleware.isUser,
  validate(orderValidation.checkoutSchema),
  orderController.checkout
);

router.post(
  "/:id/pay",
  authMiddleware,
  adminMiddleware.isUser,
  validate(orderValidation.paymentSchema),
  orderController.payOrder
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware.isUser,
  orderController.getOrders
);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware.isUser,
  orderController.getOrderById
);

export default router;
