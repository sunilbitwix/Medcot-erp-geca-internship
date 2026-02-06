// services/supplier.js
import * as supplierRepo from '../repositories/supplier.js';

export const createSupplier = async (payload) => {
  const { supplier_code, supplier_name, poc_name, created_by } = payload;

  // 🔒 Business validation
  if (!supplier_code || !supplier_name || !poc_name || !created_by) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  // 🔁 Prevent duplicate supplier
  const existingSupplier = await supplierRepo.getSupplierByCode(supplier_code);

  if (existingSupplier) {
    const err = new Error('Required fields missing');
    err.statusCode = 409;
    throw err;
  }

  // 🧠 Future-proof place for:
  // - GST validation
  // - Supplier status workflow
  // - Approval logic

  return supplierRepo.createSupplier(payload);
};

export const getSuppliers = async (options = {}) => {
  return supplierRepo.getSuppliers(options);
};

export const getSupplierByCode = async (code) => {
  if (!code) {
    const err = new Error('supplier code is required');
    err.statusCode = 400;
    throw err;
  }

  const supplier = await supplierRepo.getSupplierByCode(code);

  if (!supplier) {
    const err = new Error('Supplier not found');
    err.statusCode = 404;
    throw err;
  }

  return supplier;
};

export const updateSupplier = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const supplier = await supplierRepo.getSupplierByCode(code);
  if (!supplier) {
    const err = new Error('Supplier not found');
    err.statusCode = 404;
    throw err;
  }

  const updated = await supplierRepo.updateSupplier(code, payload);

  if (!updated) {
    const err = new Error('Supplier update failed');
    err.statusCode = 500;
    throw err;
  }
};

export const deactivateSupplier = async (code, updated_by) => {
  if (!updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const supplier = await supplierRepo.getSupplierByCode(code);
  if (!supplier) {
    const err = new Error('Supplier not found');
    err.statusCode = 404;
    throw err;
  }

  if (!supplier.is_active) {
    const err = new Error('Supplier is already inactive');
    err.statusCode = 409;
    throw err;
  }

  const updated = await supplierRepo.deactivateSupplier(code, updated_by);

  if (!updated) {
    const err = new Error('Failed to deactivate supplier');
    err.statusCode = 500;
    throw err;
  }
};

