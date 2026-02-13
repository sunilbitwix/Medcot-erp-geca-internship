import express from 'express';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import supplierRouter from './src/routes/supplierMaster.js';
import { errorHandler } from './src/middlewares/error.js';
import uomRoutes from './src/routes/uomMaster.js';
import rawMaterialRoutes from './src/routes/rawMaterialMaster.js';
import productRoutes from './src/routes/productMaster.js';
import employeeRoutes from './src/routes/employeeMaster.js';
const app = express();

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));


// -------- Routes --------

app.use('/api/suppliers', supplierRouter);



app.use('/api/uoms', uomRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRoutes);


// -------- 404 Handler --------
app.use((req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
  });


// ---------- Error handler ----------
app.use(errorHandler);
export default app;
