// routes/employeeMaster.js
import express from 'express';
import * as controller from '../controllers/employeeMaster.js';

const router = express.Router();

router.post('/', controller.createEmployee);
router.get('/', controller.getEmployees);
router.get('/:code', controller.getEmployeeByCode);
router.put('/:code', controller.updateEmployee);
router.delete('/:code', controller.deleteEmployee);

export default router;
