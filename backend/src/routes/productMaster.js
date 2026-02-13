// routes/productMaster.js
import express from 'express';
import * as controller from '../controllers/productMaster.js';

const router = express.Router();

router.post('/', controller.createProduct);
router.get('/', controller.getProducts);
router.get('/:code', controller.getProductByCode);
router.put('/:code', controller.updateProduct);
router.delete('/:code', controller.deleteProduct);
export default router;
