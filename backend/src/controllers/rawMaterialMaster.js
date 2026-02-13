// controllers/rawMaterialMaster.js
import * as rmService from '../services/rawMaterial.js';

export const createRawMaterial = async (req, res, next) => {
  try {
    const result = await rmService.createRawMaterial(req.body);
    res.status(201).json({
      success: true,
      message: 'Raw material created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRawMaterials = async (req, res, next) => {
  try {
    const data = await rmService.getRawMaterials();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRawMaterialByCode = async (req, res, next) => {
  try {
    const data = await rmService.getRawMaterialByCode(req.params.code);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateRawMaterial = async (req, res, next) => {
  try {
    await rmService.updateRawMaterial(req.params.code, req.body);
    res.status(200).json({
      success: true,
      message: 'Raw material updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRawMaterial = async (req, res, next) => {
  try {
    await rmService.deleteRawMaterial(req.params.code); 
    res.status(200).json({
      success: true,
      message: 'Raw material deleted successfully',
    });
  } catch (error) {
    next(error);
  } 
};

