import express from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplierByCode,
  updateSupplier,
  deleteSupplier,
  reactivateSupplier,
  
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
supplierRouter.patch('/:code/activate', reactivateSupplier);



export default supplierRouter;
