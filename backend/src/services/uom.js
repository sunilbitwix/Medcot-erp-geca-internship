// services/uom.js
import * as uomRepo from '../repositories/uom.js';

export const createUom = async (payload) => {
  const { uom_code, uom_name, created_by } = payload;

  // 🔒 Validation
  if (!uom_code || !uom_name || !created_by) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  // 🔁 Duplicate check
  const existing = await uomRepo.getUomByCode(uom_code);
  if (existing) {
    const err = new Error('UOM already exists');
    err.statusCode = 409;
    throw err;
  }

  await uomRepo.createUom(payload);

  return {
    uom_code,
    uom_name,
  };
};

export const getUoms = async () => {
  return uomRepo.getUoms();
};

export const getUomByCode = async (code) => {
  if (!code) {
    const err = new Error('uom code is required');
    err.statusCode = 400;
    throw err;
  }

  const uom = await uomRepo.getUomByCode(code);
  if (!uom) {
    const err = new Error('UOM not found');
    err.statusCode = 404;
    throw err;
  }

  return uom;
};

export const updateUom = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const existing = await uomRepo.getUomByCode(code);
  if (!existing) {
    const err = new Error('UOM not found');
    err.statusCode = 404;
    throw err;
  }

  const updated = await uomRepo.updateUom(code, payload);
  if (!updated) {
    const err = new Error('UOM update failed');
    err.statusCode = 500;
    throw err;
  }
};
