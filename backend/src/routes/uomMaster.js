// routes/uomMaster.js
import express from 'express';
import * as controller from '../controllers/uomMaster.js';

const router = express.Router();

router.post('/', controller.createUom);
router.get('/', controller.getUoms);
router.get('/:code', controller.getUomByCode);
router.put('/:code', controller.updateUom);

export default router;
