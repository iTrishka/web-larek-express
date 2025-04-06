import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Joi from "joi";
import { Types } from "mongoose";
import Product from "../models/product";
import { ObjectId } from "bson";

export enum PaymentType {
  Card = "card",
  Online = "online",
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
  payment: Joi.string()
    .valid("card", "online")
    .required()
    .messages({ "string.empty": "Выберете способ оплаты" }),
  email: Joi.string()
    .email()
    .required()
    .messages({ "string.empty": "Поле Email обязательно для заполнения" }),
  phone: Joi.string()
    .required()
    .messages({ "string.empty": "Поле Телефон обязательно для заполнения" }),
  address: Joi.string()
    .required()
    .messages({ "string.empty": "Поле Адрес обязательно для заполнения" }),
  total: Joi.number().required(),
  items: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({ "array.min": "Заказ должен содержать хотя бы один товар" }),
});

function validateOrder(order: IOrder) {
  const { error, value } = orderSchema.validate(order, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
  return value;
}

export const createOrder = (req: Request, res: Response) => {
  const validatedOrder = validateOrder(req.body);
  const uniqueValidatedOrder = Array.from(new Set(validatedOrder.items));

  Product.find({
    _id: {
      $in: validatedOrder.items.filter((id: ObjectId) =>
        Types.ObjectId.isValid(id)
      ),
    },
    price: { $ne: null },
  })
    .then((products) => {
      if (products.length !== uniqueValidatedOrder.length) {
        const missingIds = validatedOrder.items.filter(
          (id: ObjectId) => !products.some((product) => product._id.equals(id))
        );
        return res.status(400).json({
          error: "Товары не найдены:",
          unavailableItems: missingIds,
        });
      }

      const itemCounts = validatedOrder.items.reduce((acc: any, id: string) => {
        if (Types.ObjectId.isValid(id)) {
          acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
      }, {});

      let totalSum = 0;
      products.forEach((product) => {
        const count = itemCounts[product._id.toString()];
        totalSum += product.price * count;
      });

      if (totalSum !== validatedOrder.total) {
        return res.status(400).json({
          error: "Сумма не совпадает",
        });
      }

      res.status(200).json({
        success: true,
        message: "Заказ успешно создан",
        order: {
          id: faker.string.uuid(),
          email: req.body.total,
        },
      });
    })
    .catch((err) => {
      console.error("Ошибка БД:", err);
      res.status(500).json({
        error: "Server error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });
};
