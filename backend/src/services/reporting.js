import * as reportingRepo from '../repositories/reporting.js';

export const stockSummary = async ({ fromDate, toDate, itemType }) => {
  if (!fromDate || !toDate) {
    const err = new Error('fromDate and toDate are required');
    err.statusCode = 400;
    throw err;
  }

  return reportingRepo.stockSummary({ fromDate, toDate, itemType });
};

export const consumptionReport = async ({ woId }) => {
  if (!woId) {
    const err = new Error('woId is required');
    err.statusCode = 400;
    throw err;
  }

  return reportingRepo.consumptionReport(woId);
};

export const productionEfficiency = async ({ fromDate, toDate }) => {
  if (!fromDate || !toDate) {
    const err = new Error('fromDate and toDate are required');
    err.statusCode = 400;
    throw err;
  }

  return reportingRepo.productionEfficiency({ fromDate, toDate });
};

export const qcSummary = async ({ fromDate, toDate }) => {
  if (!fromDate || !toDate) {
    const err = new Error('fromDate and toDate are required');
    err.statusCode = 400;
    throw err;
  }

  return reportingRepo.qcSummary({ fromDate, toDate });
};

export const batchTraceability = async (batchId) => {
  if (!batchId) {
    const err = new Error('batchId is required');
    err.statusCode = 400;
    throw err;
  }

  return reportingRepo.batchTraceability(batchId);
};
