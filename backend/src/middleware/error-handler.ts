import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

const errorHandler = (
  err: Error,
  req: Request, // eslint-disable-line
  res: Response,
  next: NextFunction // eslint-disable-line
) => {
  if ('validation' in err) {
    return res.status(400).json({
      message: 'Ошибка валидации данных при создании товара',
      details: err.message,
    });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal Server Error *пупупуууу*' });
};

export default errorHandler;
