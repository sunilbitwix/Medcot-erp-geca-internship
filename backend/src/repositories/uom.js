import pool from '../config/db.js';

export const getUomByCode = async (uom_code) => {
  const [rows] = await pool.execute(
    `SELECT uom_code
     FROM uom_master
     WHERE uom_code = ?
     LIMIT 1`,
    [uom_code]
  );

  return rows[0] || null;
};
