import { Router } from 'express';
import { getProduct, createProduct } from '../controllers/product';

const router = Router();

// Роут GET /product
router.get('/', getProduct);

// Роут POST /product
router.post('/', createProduct);


export default router;
