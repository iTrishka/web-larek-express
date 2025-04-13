import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json({
    success: true,
    message: "Заказ успешно создан",
    order: {
      id: faker.string.uuid(),
      email: req.body.total,
    },
  });
};
