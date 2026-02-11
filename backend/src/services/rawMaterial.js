// services/rawMaterial.js
import * as rmRepo from '../repositories/rawMaterial.js';
import * as uomRepo from '../repositories/uom.js';

export const createRawMaterial = async (payload) => {
  const { rm_code, rm_name, uom_code, created_by } = payload;

  // 🔒 Validation
  if (!rm_code || !rm_name || !uom_code || !created_by) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  // 🔁 Duplicate check
  const existing = await rmRepo.getRawMaterialByCode(rm_code);
  if (existing) {
    const err = new Error('Raw material already exists');
    err.statusCode = 409;
    throw err;
  }

  // 🔗 UOM must exist
  const uom = await uomRepo.getUomByCode(uom_code);
  if (!uom) {
    const err = new Error('Invalid UOM');
    err.statusCode = 400;
    throw err;
  }

  await rmRepo.createRawMaterial(payload);

  return {
    rm_code,
    rm_name,
    uom_code,
  };
};

export const getRawMaterials = async () => {
  return rmRepo.getRawMaterials();
};

export const getRawMaterialByCode = async (code) => {
  if (!code) {
    const err = new Error('rm code is required');
    err.statusCode = 400;
    throw err;
  }

  const rm = await rmRepo.getRawMaterialByCode(code);
  if (!rm) {
    const err = new Error('Raw material not found');
    err.statusCode = 404;
    throw err;
  }

  return rm;
};

export const updateRawMaterial = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const existing = await rmRepo.getRawMaterialByCode(code);
  if (!existing) {
    const err = new Error('Raw material not found');
    err.statusCode = 404;
    throw err;
  }

  // ✅ Merge existing + payload (IMPORTANT)
  const updatedData = {
    rm_name: payload.rm_name ?? existing.rm_name,
    uom_code: payload.uom_code ?? existing.uom_code,
    grade: payload.grade ?? existing.grade,
    storage_condition: payload.storage_condition ?? existing.storage_condition,
    qc_required: payload.qc_required ?? existing.qc_required,
    cost: payload.cost ?? existing.cost,
    updated_by: payload.updated_by,
  };

  const updated = await rmRepo.updateRawMaterial(code, updatedData);

  if (!updated) {
    const err = new Error('Raw material update failed');
    err.statusCode = 500;
    throw err;
  }
};

export const deleteRawMaterial = async (code) => {
   
  
  const deleted = await rmRepo.deleteRawMaterial(code);
  if (!deleted) {
    const err = new Error('Failed to delete raw material');
    err.statusCode = 500;
    throw err;
  }
};  

