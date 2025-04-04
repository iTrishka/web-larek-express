import { Request, Response } from 'express';
import Product from '../models/product';

export const getProduct = (req: Request, res: Response) => {
  return Product.find({})
    .then((products) => res.status(200).send({
      "items": products,
      "total": products.length
  }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createProduct = (req: Request, res: Response) => {
  const productData = {
    ...req.body,
    price: req.body.price === null ? 0 : req.body.price // Заменяем null на 0
  };
  return Product.create(productData)
    .then((product) => res.status(200).send({ data: product }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}