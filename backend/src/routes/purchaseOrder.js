import express from 'express';
import {
  cancelPurchaseOrder,
  createPurchaseOrder,
  getPurchaseOrder,
  updatePurchaseOrder,
} from '../controllers/purchaseOrder.js';

const poRouter = express.Router();

poRouter.post('/', createPurchaseOrder);
poRouter.get('/:code', getPurchaseOrder);
poRouter.put('/:code', updatePurchaseOrder);
poRouter.delete('/:code', cancelPurchaseOrder);

export default poRouter;
