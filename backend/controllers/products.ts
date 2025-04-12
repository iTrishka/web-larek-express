import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";

export const getProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Product.find({})
    .then((products) =>
      res.status(200).send({
        items: products,
        total: products.length,
      })
    )
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    });
};

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Product.find({ title: req.body.title })
  // .then(existingProduct => {
  //   if (existingProduct) {
  //     return Promise.reject(new ConflictError('Продукт с таким названием уже существует'));
  //   }

  const productData = {
    ...req.body,
    price: req.body.price === null ? 0 : req.body.price,
  };

  //   return Product.create(productData);
  // })
  return Product.create(productData)
    .then((product) => {
      res.status(200).send({ data: product });
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes("E11000")) {
        return next(new ConflictError());
      }
      // if (error instanceof ConflictError) {
      //   return next(error);
      // }
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            "Ошибка валидации данных при создании товара" + " " + error.message
          )
        );
      }
      next(error);
    });
};
