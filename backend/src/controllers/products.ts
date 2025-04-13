import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (
  req: Request, // eslint-disable-line
  res: Response,
  next: NextFunction,
) => Product.find({})
  .then((products) => res.status(200).send({
    items: products,
    total: products.length,
  }))
  .catch((error) => {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  });

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productData = {
    ...req.body,
    price: req.body.price === null ? 0 : req.body.price,
  };

  return Product.create(productData)
    .then((product) => {
      res.status(200).send({ data: product });
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError());
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            `!Ошибка валидации данных при создании товара: ${error.message}`,
          ),
        );
      }
      return next(error);
    });
};
