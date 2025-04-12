import { Router } from "express";
import { getProducts, createProduct } from "../controllers/products";
import { createProductValidation } from "../middleware/validation";

const router = Router();

// Роут GET /product
router.get("/", getProducts);

// Роут POST /product
router.post("/", createProductValidation, createProduct);

export default router;
