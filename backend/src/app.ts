import express, { Request, Response, NextFunction } from "express";
import { errors as celebrateErrors } from "celebrate";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import productsRouter from "./routes/product";
import orderRouter from "./routes/order";
import errorHandler from "./middleware/error-handler";
import NotFoundError from "./errors/not-found-error";
import { errorLogger, requestLogger } from "./middleware/logger";
import { config } from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(config.DB_ADDRESS);

app.use(requestLogger);

app.use("/product", productsRouter);
app.use("/order", orderRouter);

app.use(errorLogger);

app.use(celebrateErrors());

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Маршрут ${req.method} ${req.originalUrl} не найден`));
});
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});
