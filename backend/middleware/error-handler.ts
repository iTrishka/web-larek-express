import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ("validation" in err) {
    return res.status(400).json({
      error: "Ошибка валидации данных при создании товара",
      details: err.message,
    });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal Server Error *пупупуууу*" });
};

export default errorHandler;
