// repositories/employee.js
import pool from '../config/db.js';

export const createEmployee = async (data) => {
  const sql = `
    INSERT INTO employee_master (
      emp_code,
      emp_name,
      role,
      department,
      phone,
      email,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await pool.execute(sql, [
    data.emp_code,
    data.emp_name,
    data.role || null,
    data.department || null,
    data.phone || null,
    data.email || null,
    data.status || 'Active',
    data.created_by,
  ]);
};

export const getEmployees = async () => {
  const [rows] = await pool.execute(`
    SELECT
      emp_code,
      emp_name,
      role,
      department,
      phone,
      email,
      status,
      created_at,
      updated_at
    FROM employee_master
    ORDER BY emp_name
  `);

  return rows;
};

export const getEmployeeByCode = async (code) => {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM employee_master
    WHERE emp_code = ?
    LIMIT 1
    `,
    [code]
  );

  return rows[0] || null;
};

export const updateEmployee = async (code, data) => {
  const sql = `
    UPDATE employee_master
    SET
      emp_name = ?,
      role = ?,
      department = ?,
      phone = ?,
      email = ?,
      status = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE emp_code = ?
  `;

  const [result] = await pool.execute(sql, [
    data.emp_name,
    data.role || null,
    data.department || null,
    data.phone || null,
    data.email || null,
    data.status || 'Active',
    data.updated_by,
    code,
  ]);

  return result.affectedRows;
};

export const deleteEmployee = async (code) => {
  const sql = `
    DELETE FROM employee_master
    WHERE emp_code = ?
  `;    
  const [result] = await pool.execute(sql, [code]);

  return result.affectedRows;
};