import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

const createOrder = (req: Request, res: Response) => res.status(200).json({
  success: true,
  message: 'Заказ успешно создан',
  order: {
    id: faker.string.uuid(),
    total: req.body.total,

  },
});

export default createOrder;
