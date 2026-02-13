import * as reportingService from '../services/reporting.js';

export const getStockSummary = async (req, res, next) => {
  try {
    const data = await reportingService.stockSummary(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getConsumptionReport = async (req, res, next) => {
  try {
    const data = await reportingService.consumptionReport(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProductionEfficiency = async (req, res, next) => {
  try {
    const data = await reportingService.productionEfficiency(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getQcSummary = async (req, res, next) => {
  try {
    const data = await reportingService.qcSummary(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBatchTraceability = async (req, res, next) => {
  try {
    const data = await reportingService.batchTraceability(req.params.batchId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
