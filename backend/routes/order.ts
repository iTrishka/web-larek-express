import { Router } from 'express';
import { createOrder} from '../controllers/order';

const router = Router();

// Роут POST /order
router.post('/', createOrder);


export default router;