// controllers/uomMaster.js
import * as uomService from '../services/uom.js';

export const createUom = async (req, res, next) => {
  try {
    const result = await uomService.createUom(req.body);
    res.status(201).json({
      success: true,
      message: 'UOM created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUoms = async (req, res, next) => {
  try {
    const data = await uomService.getUoms();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUomByCode = async (req, res, next) => {
  try {
    const data = await uomService.getUomByCode(req.params.code);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateUom = async (req, res, next) => {
  try {
    await uomService.updateUom(req.params.code, req.body);
    res.status(200).json({
      success: true,
      message: 'UOM updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
    