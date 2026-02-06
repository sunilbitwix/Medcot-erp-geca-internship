// repositories/supplier.js
import pool from '../config/db.js';

export const createSupplier = async (data) => {
  const sql = `
    INSERT INTO supplier_master (
      supplier_code,
      supplier_name,
      poc_name,
      gst_number,
      phone,
      email,
      address,
      payment_terms,
      lead_time_days,
      is_active,
      extra_details,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await pool.execute(sql, [
    data.supplier_code,
    data.supplier_name,
    data.poc_name,
    data.gst_number,
    data.phone,
    data.email,
    data.address,
    data.payment_terms,
    data.lead_time_days,
    data.is_active ?? true,
    data.extra_details,
    data.created_by,
  ]);

  return {
    supplier_code: data.supplier_code,
  };
};

export const getSuppliers = async ({ includeInactive = false } = {}) => {
  let sql = `
    SELECT *
    FROM supplier_master
  `;

  const params = [];

  if (!includeInactive) {
    sql += ` WHERE is_active = TRUE`;
  }

  sql += ` ORDER BY created_at DESC`;

  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const getSupplierByCode = async (supplier_code) => {
  const [rows] = await pool.execute(
    `SELECT *
     FROM supplier_master
     WHERE supplier_code = ?
     LIMIT 1`,
    [supplier_code]
  );

  return rows.length ? rows[0] : null;
};

export const updateSupplier = async (supplier_code, data) => {
  const sql = `
    UPDATE supplier_master
    SET
      supplier_name = ?,
      poc_name = ?,
      gst_number = ?,
      phone = ?,
      email = ?,
      address = ?,
      payment_terms = ?,
      lead_time_days = ?,
      is_active = ?,
      extra_details = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE supplier_code = ?
  `;

  const [result] = await pool.execute(sql, [
    data.supplier_name,
    data.poc_name,
    data.gst_number,
    data.phone,
    data.email,
    data.address,
    data.payment_terms,
    data.lead_time_days,
    data.is_active,
    data.extra_details,
    data.updated_by,
    supplier_code,
  ]);

  return result.affectedRows;
};

export const deactivateSupplier = async (supplier_code, updated_by) => {
  const sql = `
    UPDATE supplier_master
    SET
      is_active = FALSE,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE supplier_code = ?
  `;

  const [result] = await pool.execute(sql, [updated_by, supplier_code]);

  return result.affectedRows;
};
