// controllers/employeeMaster.js
import * as employeeService from '../services/employee.js';

export const createEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.createEmployee(req.body);
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const data = await employeeService.getEmployees();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByCode = async (req, res, next) => {
  try {
    const data = await employeeService.getEmployeeByCode(req.params.code);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    await employeeService.updateEmployee(req.params.code, req.body);
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.deleteEmployee(req.params.code);  
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }   
};  
