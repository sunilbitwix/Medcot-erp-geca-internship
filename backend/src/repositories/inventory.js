
import pool from '../config/db.js';

/**
 * Get all inventory transactions
 */
export async function getAllInventory() {
  const [rows] = await pool.query(
    'SELECT * FROM inventory_transaction ORDER BY created_at DESC'
  );
  return rows;
}

/**
 * Get inventory count
 */
export async function getInventoryCount() {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS count FROM inventory_transaction'
  );
  return rows[0].count;
}

/**
 * Add inventory transaction
 */
export async function addInventory(data) {
  const {
    txn_code,
    txn_date,
    item_code,
    item_type,
    txn_type,
    quantity,
    created_by
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO inventory_transaction
    (
      txn_code,
      txn_date,
      item_code,
      item_type,
      txn_type,
      quantity,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      txn_code,
      txn_date,
      item_code,
      item_type,
      txn_type,
      quantity,
      created_by
    ]
  );

  return result.insertId;
}

/**
 * Update inventory transaction
 */
export async function updateInventory(txn_code, data) {
  const {
    txn_date,
    item_code,
    item_type,
    txn_type,
    quantity,
    updated_by
  } = data;

  const [result] = await pool.query(
    `
    UPDATE inventory_transaction
    SET
      txn_date = ?,
      item_code = ?,
      item_type = ?,
      txn_type = ?,
      quantity = ?,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = ?
    WHERE txn_code = ?
    `,
    [
      txn_date,
      item_code,
      item_type,
      txn_type,
      quantity,
      updated_by,
      txn_code
    ]
  );

  return result.affectedRows;
}

/**
 * Delete inventory transaction
 */
export async function deleteInventory(txn_code) {
  const [result] = await pool.query(
    'DELETE FROM inventory_transaction WHERE txn_code = ?',
    [txn_code]
  );

  return result.affectedRows;
}
