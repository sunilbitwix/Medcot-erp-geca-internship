// repositories/rawMaterial.js
import pool from '../config/db.js';

export const createRawMaterial = async (data) => {
  const sql = `
    INSERT INTO raw_material_master (
      rm_code,
      rm_name,
      uom_code,
      grade,
      storage_condition,
      qc_required,
      cost,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await pool.execute(sql, [
    data.rm_code,
    data.rm_name,
    data.uom_code,
    data.grade || null,
    data.storage_condition || null,
    data.qc_required ?? true,
    data.cost || null,
    data.created_by,
  ]);
};

export const getRawMaterials = async () => {
  const [rows] = await pool.execute(`
    SELECT
      rm.rm_code,
      rm.rm_name,
      rm.uom_code,
      u.uom_name,
      rm.grade,
      rm.storage_condition,
      rm.qc_required,
      rm.cost,
      rm.created_at,
      rm.updated_at
    FROM raw_material_master rm
    JOIN uom_master u ON rm.uom_code = u.uom_code
    ORDER BY rm.rm_name
  `);

  return rows;
};

export const getRawMaterialByCode = async (code) => {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM raw_material_master
    WHERE rm_code = ?
    LIMIT 1
    `,
    [code]
  );

  return rows[0] || null;
};

export const updateRawMaterial = async (code, data) => {
  const sql = `
    UPDATE raw_material_master
    SET
      rm_name = ?,
      uom_code = ?,
      grade = ?,
      storage_condition = ?,
      qc_required = ?,
      cost = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE rm_code = ?
  `;

  const [result] = await pool.execute(sql, [
    data.rm_name,
    data.uom_code,
    data.grade || null,
    data.storage_condition || null,
    data.qc_required ?? true,
    data.cost || null,
    data.updated_by,
    code,
  ]);

  return result.affectedRows;
};

export const deleteRawMaterial = async (code) => {
  const sql = `
    DELETE FROM raw_material_master
    WHERE rm_code = ?
  `;
  const [result] = await pool.execute(sql, [code]);

  return result.affectedRows;
};

