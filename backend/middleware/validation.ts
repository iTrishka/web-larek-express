import { celebrate, Joi, Segments } from "celebrate";
import Product from "../models/product";

export const getProductValidation = {
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
};

export const createProductValidation = {
  title: Joi.string().min(2).max(30).required().messages({
    "string.min": "Название должно быть не короче {#limit} символов",
    "string.max": "Название должно быть не длиннее {#limit} символов",
    "any.required": "Название обязательно",
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
};
