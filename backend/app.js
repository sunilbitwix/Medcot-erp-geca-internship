import inventoryRoutes from './src/routes/inventory.js';
import express from 'express';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import poRouter from './src/routes/purchaseOrder.js';
import supplierRouter from './src/routes/supplierMaster.js';
import { errorHandler } from './src/middlewares/error.js';

const app = express();

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));


// -------- Routes --------
app.use('/api/v1/pos', poRouter);
app.use('/api/v1/suppliers', supplierRouter);
app.use('/api/inventory', inventoryRoutes);


// -------- 404 Handler --------
app.use((req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
  });


// ---------- Error handler ----------
app.use(errorHandler);
export default app;
