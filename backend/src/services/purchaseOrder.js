import * as rmRepo from '../repositories/rawMaterial.js';
import * as uomRepo from '../repositories/uom.js';
import * as poRepo from '../repositories/purchaseOrder.js';
import * as poItemRepo from '../repositories/purchaseOrderItem.js';
import * as supplierRepo from '../repositories/supplier.js';
import pool from '../config/db.js';

const generatePoCode = async (connection) => {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS count FROM purchase_order`
  );

  const next = rows[0].count + 1;

  return `POO${String(next).padStart(5, '0')}`;
};

export const createPurchaseOrder = async (payload) => {
  const { supplier_code, po_date, lead_time_days, created_by, items } = payload;

  // 1️⃣ Basic validation
  if (
    !supplier_code ||
    !po_date ||
    !created_by ||
    !Array.isArray(items) ||
    !items.length
  ) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  // 2️⃣ Validate supplier exists
  const supplier = await supplierRepo.getSupplierByCode(supplier_code);
  if (!supplier || !supplier.is_active) {
    const err = new Error('Invalid or inactive supplier');
    err.statusCode = 400;
    throw err;
  }

  // 3️⃣ Validate items (business rules)
  const seenRmCodes = new Set();

  for (const item of items) {
    if (
      !item.rm_code ||
      !item.uom_code ||
      !item.quantity ||
      item.quantity <= 0
    ) {
      const err = new Error('Invalid PO item data');
      err.statusCode = 400;
      throw err;
    }

    if (seenRmCodes.has(item.rm_code)) {
      const err = new Error(`Duplicate raw material in PO: ${item.rm_code}`);
      err.statusCode = 409;
      throw err;
    }

    seenRmCodes.add(item.rm_code);
  }

  // 4️⃣ Validate RM & UOM existence
  for (const item of items) {
    const rm = await rmRepo.getRawMaterialByCode(item.rm_code);
    if (!rm) {
      const err = new Error(`Invalid raw material: ${item.rm_code}`);
      err.statusCode = 400;
      throw err;
    }

    const uom = await uomRepo.getUomByCode(item.uom_code);
    if (!uom) {
      const err = new Error(`Invalid UOM: ${item.uom_code}`);
      err.statusCode = 400;
      throw err;
    }
  }

  // 5️⃣ Transaction begins
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 6️⃣ Generate PO code
    const po_code = await generatePoCode(connection);

    // 7️⃣ Insert PO header
    await poRepo.createPurchaseOrder(connection, {
      po_code,
      supplier_code,
      po_date,
      lead_time_days,
      status: 'Pending',
      created_by,
    });

    const cleanItems = items.map(item => ({
      rm_code: item.rm_code,
      quantity: item.quantity,
      uom_code: item.uom_code,
      rate: item.rate,
      tax_pct: item.tax_pct,
    }));
    

    // 8️⃣ Prepare items
    const poItems = cleanItems.map((item, index) => ({
      po_item_code: `${po_code}-ITM${String(index + 1).padStart(3, '0')}`,
      po_code,
      rm_code: item.rm_code,
      quantity: item.quantity,
      uom_code: item.uom_code,
      rate: item.rate,
      tax_pct: item.tax_pct,
      created_by,
    }));
    

    // 9️⃣ Insert items
    await poItemRepo.createPurchaseOrderItems(connection, poItems);

    await connection.commit();

    return {
      po_code,
      status: 'Pending',
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getPurchaseOrder = async (code) => {
  if (!code) {
    const err = new Error('po code is required');
    err.statusCode = 400;
    throw err;
  }

  const po = await poRepo.getPurchaseOrderByCode(code);
  if (!po) {
    const err = new Error('Purchase Order not found');
    err.statusCode = 404;
    throw err;
  }

  const items = await poItemRepo.getItemsByPoCode(code);

  return {
    ...po,
    items,
  };
};

export const updatePurchaseOrder = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const po = await poRepo.getPurchaseOrderByCode(code);
  if (!po) {
    const err = new Error('Purchase Order not found');
    err.statusCode = 404;
    throw err;
  }

  if (po.status !== 'Pending') {
    const err = new Error(`PO cannot be updated in ${po.status} status`);
    err.statusCode = 409;
    throw err;
  }

  const updated = await poRepo.updatePurchaseOrder(code, payload);

  if (!updated) {
    const err = new Error('Failed to update Purchase Order');
    err.statusCode = 500;
    throw err;
  }
};

export const cancelPurchaseOrder = async (code, updated_by) => {
  if (!updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const po = await poRepo.getPurchaseOrderByCode(code);
  if (!po) {
    const err = new Error('Purchase Order not found');
    err.statusCode = 404;
    throw err;
  }

  if (['Cancelled', 'Closed'].includes(po.status)) {
    const err = new Error(`PO is already ${po.status}`);
    err.statusCode = 409;
    throw err;
  }

  const updated = await poRepo.cancelPurchaseOrder(code, updated_by);

  if (!updated) {
    const err = new Error('Failed to cancel Purchase Order');
    err.statusCode = 500;
    throw err;
  }
};

