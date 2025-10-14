import express from "express";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";
import validations from "../validations/index.js";

const { adminController } = controllers;
const { authMiddleware, adminMiddleware, validate } = middlewares;
const { adminValidation } = validations;

const router = express.Router();

router.get(
  "/orders",
  authMiddleware,
  adminMiddleware.isAdmin,
  adminController.getAllOrders
);

router.patch(
  "/orders/:id/status",
  authMiddleware,
  validate(adminValidation.updateOrderStatusValidation),
  adminMiddleware.isAdmin,
  adminController.updateOrderStatus
);

export default router;
