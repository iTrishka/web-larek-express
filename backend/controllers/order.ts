import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import Joi from "joi";
import { Types, Error as MongooseError } from "mongoose";
import Product from "../models/product";
import { ObjectId } from "bson";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";

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

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = orderSchema.validate(req.body);

  if (error) {
    return next(
      new BadRequestError(
        "Ошибка валидации данных при оформлении заказа" + " " + error.message
      )
    );
  }

  const uniqueValidatedOrder = Array.from(new Set(value.items));

  Product.find({
    _id: {
      $in: value.items.filter((id: ObjectId) => Types.ObjectId.isValid(id)),
    },
    price: { $ne: null },
  })
    .then((products) => {
      if (products.length !== uniqueValidatedOrder.length) {
        const missingIds = value.items.filter(
          (id: ObjectId) => !products.some((product) => product._id.equals(id))
        );
        return next(new NotFoundError(`Товар(ы) ${missingIds} не найдены`));
      }

      const itemCounts = value.items.reduce((acc: any, id: string) => {
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

      if (totalSum !== value.total) {
        return next(
          new BadRequestError(
            "Сумма не совпадает" + " " + totalSum + " " + value.total
          )
        );
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
      return next(err);
    });
};
