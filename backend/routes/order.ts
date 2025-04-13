import { Router } from "express";
import { createOrder } from "../controllers/order";
import {
  orderValidation,
  compareTotalPriceValidation,
} from "../middleware/validation";

const router = Router();

// Роут POST /order
router.post("/", orderValidation, compareTotalPriceValidation, createOrder);

export default router;
