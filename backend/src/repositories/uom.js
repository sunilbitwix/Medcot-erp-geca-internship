// repositories/uom.js
import pool from '../config/db.js';

/**
 * Create UOM
 */
export const createUom = async (data) => {
  const sql = `
    INSERT INTO uom_master (
      uom_code,
      uom_name,
      description,
      created_by
    )
    VALUES (?, ?, ?, ?)
  `;

  await pool.execute(sql, [
    data.uom_code,
    data.uom_name,
    data.description || null,
    data.created_by,
  ]);
};

/**
 * Get all UOMs
 */
export const getUoms = async () => {
  const [rows] = await pool.execute(
    `
    SELECT
      uom_code,
      uom_name,
      description,
      created_at,
      updated_at
    FROM uom_master
    ORDER BY uom_name
    `
  );

  return rows;
};

/**
 * Get UOM by code
 */
export const getUomByCode = async (code) => {
  const [rows] = await pool.execute(
    `
    SELECT
      uom_code,
      uom_name,
      description,
      created_at,
      updated_at
    FROM uom_master
    WHERE uom_code = ?
    LIMIT 1
    `,
    [code]
  );

  return rows[0] || null;
};

/**
 * Update UOM
 */
export const updateUom = async (code, data) => {
  const sql = `
    UPDATE uom_master
    SET
      uom_name = ?,
      description = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE uom_code = ?
  `;

  const [result] = await pool.execute(sql, [
    data.uom_name,
    data.description || null,
    data.updated_by,
    code,
  ]);

  return result.affectedRows;
};
