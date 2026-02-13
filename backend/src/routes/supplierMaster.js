import express from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplierByCode,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierMaster.js';

const supplierRouter = express.Router();

/**
 * Supplier Routes
 */

// -------- Core CRUD --------
supplierRouter.post('/', createSupplier);
supplierRouter.get('/', getSuppliers);
supplierRouter.get('/:code', getSupplierByCode);
supplierRouter.put('/:code', updateSupplier);
supplierRouter.delete('/:code', deleteSupplier);

export default supplierRouter;
