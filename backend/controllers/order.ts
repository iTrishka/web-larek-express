import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Joi from 'joi';

export enum PaymentType {
  Card = 'card',
  Online = 'online',
}

export interface IOrder {
  payment: PaymentType;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const orderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total:  Joi.number().required(),
  items: Joi.array().items(Joi.string()).required()
});

function validateOrder(order: IOrder) {
  const { error, value } = orderSchema.validate(order);
  if (error) {
      throw new Error(`Validation error: ${error.message}`);
  }
  return value;
}

export const createOrder= (req: Request, res: Response) => {
  const validatedOrder = validateOrder(req.body)

  res.status(200).json({
    message: "Заказ успешно создан",
    user: {
      id: faker.string.uuid(),
      email: req.body.total
    }
  });
  // return req.body
  //   .then((product) => res.status(200).send({ data: product }))
  //   .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}