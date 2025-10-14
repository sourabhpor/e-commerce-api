import express from "express";
import controllers from "../controllers/index.js";
import validations from "../validations/index.js";
import middlewares from "../middlewares/index.js";

const { productController } = controllers;
const { productValidation } = validations;
const { validate, authMiddleware, adminMiddleware } = middlewares;

const router = express.Router();

// Public route
router.get("/", productController.getProducts);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware.isAdmin,
  validate(productValidation.createProductValidation),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware.isAdmin,
  validate(productValidation.updateProductValidation),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware.isAdmin,
  productController.deleteProduct
);

export default router;
