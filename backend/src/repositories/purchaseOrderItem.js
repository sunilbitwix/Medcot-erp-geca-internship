import pool from '../config/db.js';

/**
 * Insert PO items (bulk)
 * Uses same transaction connection
 */
export const createPurchaseOrderItems = async (connection, items) => {
  const sql = `
    INSERT INTO purchase_order_item (
      po_item_code,
      po_code,
      rm_code,
      quantity,
      uom_code,
      rate,
      tax_pct,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const item of items) {
    await connection.execute(sql, [
      item.po_item_code,
      item.po_code,
      item.rm_code,
      item.quantity,
      item.uom_code,
      item.rate,
      item.tax_pct,
      item.created_by,
    ]);
  }
};

/**
 * Get all items for a PO
 */
export const getItemsByPoCode = async (po_code) => {
  const [rows] = await pool.execute(
    `SELECT *
     FROM purchase_order_item
     WHERE po_code = ?`,
    [po_code]
  );

  return rows;
};
