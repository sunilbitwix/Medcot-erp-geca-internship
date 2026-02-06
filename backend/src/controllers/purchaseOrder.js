import * as purchaseOrderService from '../services/purchaseOrder.js';

//const {createPurchaseOrder, getPurchaseOrder, updatePurchaseOrder, cancelPurchaseOrder} = purchaseOrderService;

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const result = await purchaseOrderService.createPurchaseOrder(req.body);

    res.status(201).json({
      success: true,
      message: 'Purchase Order created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrder = async (req, res, next) => {
  try {
    const po = await purchaseOrderService.getPurchaseOrder(
      req.params.code
    );

    res.status(200).json({
      success: true,
      data: po,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseOrder = async (req, res, next) => {
  try {
    await purchaseOrderService.updatePurchaseOrder(
      req.params.code,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Purchase Order updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const cancelPurchaseOrder = async (req, res, next) => {
  try {
    await purchaseOrderService.cancelPurchaseOrder(
      req.params.code,
      req.body.updated_by
    );

    res.status(200).json({
      success: true,
      message: 'Purchase Order cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

