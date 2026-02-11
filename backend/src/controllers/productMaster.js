// controllers/productMaster.js
import * as productService from '../services/product.js';

export const createProduct = async (req, res, next) => {
  try {
    const result = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const data = await productService.getProducts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProductByCode = async (req, res, next) => {
  try {
    const data = await productService.getProductByCode(req.params.code);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    await productService.updateProduct(req.params.code, req.body);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.code);      
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }   
};  
