import pool from '../config/db.js';

// Insert PO header NOTE: connection is passed from service (transaction control)
export const createPurchaseOrder = async (connection, data) => {
  const sql = `
    INSERT INTO purchase_order (
      po_code,
      supplier_code,
      po_date,
      lead_time_days,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  await connection.execute(sql, [
    data.po_code,
    data.supplier_code,
    data.po_date,
    data.lead_time_days,
    data.status,
    data.created_by,
  ]);
};

// Get PO header by code
export const getPurchaseOrderByCode = async (po_code) => {
  const [rows] = await pool.execute(
    `SELECT *
     FROM purchase_order
     WHERE po_code = ?
     LIMIT 1`,
    [po_code]
  );

  return rows[0] || null;
};

// update PO header (restricted by service rules)
export const updatePurchaseOrder = async (po_code, data) => {
  const sql = `
    UPDATE purchase_order
    SET
      supplier_code = ?,
      po_date = ?,
      lead_time_days = ?,
      status = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_code = ?
  `;

  const [result] = await pool.execute(sql, [
    data.supplier_code,
    data.po_date,
    data.lead_time_days,
    data.status,
    data.updated_by,
    po_code,
  ]);

  return result.affectedRows;
};

// cancle Po(soft delete)
export const cancelPurchaseOrder = async (po_code, updated_by) => {
  const sql = `
    UPDATE purchase_order
    SET
      status = 'Cancelled',
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_code = ?
  `;

  const [result] = await pool.execute(sql, [updated_by, po_code]);

  return result.affectedRows;
};
