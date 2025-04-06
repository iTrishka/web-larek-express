import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import productsRouter from '../routes/product';
import orderRouter from '../routes/order';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.use('/product', productsRouter);
app.use('/order', orderRouter);

// app.get('/product', getProduct)
app.listen(3000, () => {console.log('listening on port 3000')})