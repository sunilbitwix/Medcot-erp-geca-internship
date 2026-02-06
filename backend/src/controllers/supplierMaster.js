// controllers/supplierMaster.js
import * as supplierService from '../services/supplier.js';

export const createSupplier = async (req, res, next) => {
  try {
    const result = await supplierService.createSupplier(req.body);

    return res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierService.getSuppliers({
      includeInactive: req.query.includeInactive === 'true',
    });

    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};

export const getSupplierByCode = async (req, res, next) => {
  try {
    const supplier = await supplierService.getSupplierByCode(
      req.params.code
    );

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    await supplierService.updateSupplier(
      req.params.code,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    await supplierService.deactivateSupplier(
      req.params.code,
      req.body.updated_by
    );

    res.status(200).json({
      success: true,
      message: 'Supplier deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};
