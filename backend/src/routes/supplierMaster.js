import express from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplierByCode,
  updateSupplier,
  deleteSupplier,
  // activateSupplier,
  // deactivateSupplier,
  // searchSuppliers,
  // getSupplierSummary,
  // getSupplierUsage,
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

// -------- Status Management --------
// supplierRouter.patch('/:code/activate', activateSupplier);
// supplierRouter.patch('/:code/deactivate', deactivateSupplier);

// -------- Search & Validation --------
// supplierRouter.get('/search/?name', searchSuppliers);

// -------- Supplier Insights (ERP level) --------
// supplierRouter.get('/:code/summary', getSupplierSummary);
// supplierRouter.get('/:code/usage', getSupplierUsage);

export default supplierRouter;
