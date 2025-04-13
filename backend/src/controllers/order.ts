import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

const createOrder = (req: Request, res: Response) => res.status(201).json({
  success: true,
  message: 'Заказ успешно создан',
  order: {
    id: faker.string.uuid(),
    email: req.body.total,
  },
});

export default createOrder;
