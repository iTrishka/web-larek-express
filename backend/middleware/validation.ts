import { NextFunction, Request, Response } from 'express';
import {celebrate, Joi, Segments} from "celebrate";
import { ObjectId } from "bson";
import { Types, Error as MongooseError } from "mongoose";
import Product from "../models/product";
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import { error } from 'console';

const productSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(30)
    .required()
    .external(async (value, helpers) => {
      const product = await Product.findOne({ title: value });
      if (product) {
        return helpers.error("any.notUnique", { value });
      }
      return value;
    })
    .messages({
      "string.min": "Название должно быть не короче {#limit} символов",
      "string.max": "Название должно быть не длиннее {#limit} символов",
      "any.required": "Название обязательно",
      "any.notUnique": 'Продукт с названием "{#value}" уже существует',
    }),
  image: Joi.object({
    fileName: Joi.string().required().messages({
      "any.required": "Имя файла обязательно",
    }),
    originalName: Joi.string().required().messages({
      "any.required": "Оригинальное имя файла обязательно",
    }),
  }).required(),
  category: Joi.string().required().messages({
    "any.required": "Категория обязательна",
  }),
  description: Joi.string().allow(""),
  price: Joi.number().allow(null),
});



export const createProductValidation = (req: Request, res: Response, next: NextFunction) => {

  const { error } = productSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new BadRequestError(
        "Ошибка валидации данных при оформлении заказа" + " " + error.message
      )
    );
  }

  next();
};


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


export const orderValidation = (req: Request, res: Response, next: NextFunction) => {

  const { error } = orderSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new BadRequestError(
        "Ошибка валидации данных при оформлении заказа" + " " + error.message
      )
    );
  }

  next();
};

export const compareTotalPriceValidation = (req: Request, res: Response, next: NextFunction) => {
  console.log("compareTotalPriceValidation ", req.body)
  const value = req.body

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

      if (totalSum != value.total) {
        return next(
          new BadRequestError(
            "Сумма не совпадает" + " " + totalSum + " " + value.total
          )
        );
      }
      next();
    })
};