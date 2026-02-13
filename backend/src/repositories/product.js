// repositories/product.js
import pool from '../config/db.js';

export const createProduct = async (data) => {
  const sql = `
    INSERT INTO product_master (
      product_code,
      product_name,
      category,
      uom_code,
      tax_category,
      packaging,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await pool.execute(sql, [
    data.product_code,
    data.product_name,
    data.category || null,
    data.uom_code || null,
    data.tax_category || null,
    data.packaging || null,
    data.status || 'Active',
    data.created_by,
  ]);
};

export const getProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT
      product_code,
      product_name,
      category,
      uom_code,
      tax_category,
      packaging,
      status,
      created_at,
      updated_at
    FROM product_master
    ORDER BY product_name
  `);

  return rows;
};

export const getProductByCode = async (code) => {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM product_master
    WHERE product_code = ?
    LIMIT 1
    `,
    [code]
  );

  return rows[0] || null;
};

export const updateProduct = async (code, data) => {
  const sql = `
    UPDATE product_master
    SET
      product_name = ?,
      category = ?,
      uom_code = ?,
      tax_category = ?,
      packaging = ?,
      status = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE product_code = ?
  `;

  const [result] = await pool.execute(sql, [
    data.product_name,
    data.category || null,
    data.uom_code || null,
    data.tax_category || null,
    data.packaging || null,
    data.status || 'Active',
    data.updated_by,
    code,
  ]);

  return result.affectedRows;
};


export const deleteProduct = async (code) => {
  const sql = `
    DELETE FROM product_master
    WHERE product_code = ?
  `;    
  const [result] = await pool.execute(sql, [code]);

  return result.affectedRows; 

};
