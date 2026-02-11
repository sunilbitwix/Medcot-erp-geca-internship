// services/supplier.js
import * as supplierRepo from '../repositories/supplier.js';

/**
 * Create Supplier
 */
export const createSupplier = async (payload) => {
  const { supplier_code, supplier_name, poc_name, created_by } = payload;

  // 🔒 Basic validation
  if (!supplier_code || !supplier_name || !poc_name || !created_by) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  // 🔁 Prevent duplicate supplier
  const existingSupplier = await supplierRepo.getSupplierByCode(supplier_code);
  if (existingSupplier) {
    const err = new Error('Supplier with this code already exists');
    err.statusCode = 409;
    throw err;
  }

  return supplierRepo.createSupplier(payload);
};

/**
 * Get all suppliers
 */
export const getSuppliers = async (options = {}) => {
  return supplierRepo.getSuppliers(options);
};

/**
 * Get supplier by code
 */
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

/**
 * Update supplier (PARTIAL UPDATE SAFE)
 */
export const updateSupplier = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  // 1️⃣ Fetch existing supplier
  const supplier = await supplierRepo.getSupplierByCode(code);
  if (!supplier) {
    const err = new Error('Supplier not found');
    err.statusCode = 404;
    throw err;
  }

  // 2️⃣ Merge existing data + payload
  const updatedData = {
    supplier_name: payload.supplier_name ?? supplier.supplier_name,
    poc_name: payload.poc_name ?? supplier.poc_name,
    gst_number: payload.gst_number ?? supplier.gst_number,
    phone: payload.phone ?? supplier.phone,
    email: payload.email ?? supplier.email,
    address: payload.address ?? supplier.address,
    payment_terms: payload.payment_terms ?? supplier.payment_terms,
    lead_time_days: payload.lead_time_days ?? supplier.lead_time_days,
    is_active: payload.is_active ?? supplier.is_active,
    extra_details: payload.extra_details ?? supplier.extra_details,
    updated_by: payload.updated_by,
  };

  // 3️⃣ Update via repository
  const updated = await supplierRepo.updateSupplier(code, updatedData);

  if (!updated) {
    const err = new Error('Supplier update failed');
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Deactivate supplier (soft delete)
 */
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

/**
 * Reactivate supplier (reverse soft delete)
 */
export const reactivateSupplier = async (code, updated_by) => {
  if (!updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  // 1️⃣ Check supplier exists
  const supplier = await supplierRepo.getSupplierByCode(code);
  if (!supplier) {
    const err = new Error('Supplier not found');
    err.statusCode = 404;
    throw err;
  }

  // 2️⃣ If already active
  if (supplier.is_active) {
    const err = new Error('Supplier is already active');
    err.statusCode = 409;
    throw err;
  }

  // 3️⃣ Reactivate in DB
  const updated = await supplierRepo.reactivateSupplier(code, updated_by);

  if (!updated) {
    const err = new Error('Failed to reactivate supplier');
    err.statusCode = 500;
    throw err;
  }
};

