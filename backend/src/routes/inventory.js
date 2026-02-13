import express from 'express';
import {
  getInventory,
  createInventory,
  updateInventoryController,
  deleteInventoryController
} from '../controllers/inventory.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', createInventory);
router.put('/:txn_code', updateInventoryController);
router.delete('/:txn_code', deleteInventoryController);

export default router;
