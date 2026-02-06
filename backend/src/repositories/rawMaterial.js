import pool from '../config/db.js';

export const getRawMaterialByCode = async (rm_code) => {
  const [rows] = await pool.execute(
    `SELECT rm_code, uom_code
     FROM raw_material_master
     WHERE rm_code = ?
     LIMIT 1`,
    [rm_code]
  );

  return rows[0] || null;
};
