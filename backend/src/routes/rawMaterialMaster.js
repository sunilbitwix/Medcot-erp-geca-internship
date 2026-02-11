// routes/rawMaterialMaster.js
import express from 'express';
import * as controller from '../controllers/rawMaterialMaster.js';

const router = express.Router();

router.post('/', controller.createRawMaterial);
router.get('/', controller.getRawMaterials);
router.get('/:code', controller.getRawMaterialByCode);
router.put('/:code', controller.updateRawMaterial);
router.delete('/:code', controller.deleteRawMaterial);

export default router;
