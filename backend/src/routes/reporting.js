import express from 'express';
import {
  getStockSummary,
  getConsumptionReport,
  getProductionEfficiency,
  getQcSummary,
  getBatchTraceability,
} from '../controllers/reporting.js';

const reportingRouter = express.Router();

reportingRouter.get('/stock-summary', getStockSummary);
reportingRouter.get('/consumption', getConsumptionReport);
reportingRouter.get('/production-efficiency', getProductionEfficiency);
reportingRouter.get('/qc-summary', getQcSummary);
reportingRouter.get('/batch-traceability/:batchId', getBatchTraceability);

export default reportingRouter;
