// services/employee.js
import * as employeeRepo from '../repositories/employee.js';

export const createEmployee = async (payload) => {
  const { emp_code, emp_name, created_by } = payload;

  // 🔒 Validation
  if (!emp_code || !emp_name || !created_by) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  // 🔁 Duplicate check
  const existing = await employeeRepo.getEmployeeByCode(emp_code);
  if (existing) {
    const err = new Error('Employee already exists');
    err.statusCode = 409;
    throw err;
  }

  await employeeRepo.createEmployee(payload);

  return {
    emp_code,
    emp_name,
    status: 'Active',
  };
};

export const getEmployees = async () => {
  return employeeRepo.getEmployees();
};

export const getEmployeeByCode = async (code) => {
  if (!code) {
    const err = new Error('employee code is required');
    err.statusCode = 400;
    throw err;
  }

  const employee = await employeeRepo.getEmployeeByCode(code);
  if (!employee) {
    const err = new Error('Employee not found');
    err.statusCode = 404;
    throw err;
  }

  return employee;
};

export const updateEmployee = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const employee = await employeeRepo.getEmployeeByCode(code);
  if (!employee) {
    const err = new Error('Employee not found');
    err.statusCode = 404;
    throw err;
  }

  // ✅ Merge existing + payload
  const updatedData = {
    emp_name: payload.emp_name ?? employee.emp_name,
    role: payload.role ?? employee.role,
    department: payload.department ?? employee.department,
    phone: payload.phone ?? employee.phone,
    email: payload.email ?? employee.email,
    status: payload.status ?? employee.status,
    updated_by: payload.updated_by,
  };

  const updated = await employeeRepo.updateEmployee(code, updatedData);

  if (!updated) {
    const err = new Error('Employee update failed');
    err.statusCode = 500;
    throw err;
  }
};

export const deleteEmployee = async (code) => {
  const deleted = await employeeRepo.deleteEmployee(code);
  if (!deleted) { 
    const err = new Error('Employee not found');
    err.statusCode = 404;
    throw err;
  } 
};

