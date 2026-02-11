import * as productRepo from '../repositories/product.js';
import * as uomRepo from '../repositories/uom.js';

export const createProduct = async (payload) => {
  const { product_code, product_name, created_by } = payload;

  if (!product_code || !product_name || !created_by) {
    const err = new Error('Required fields missing');
    err.statusCode = 400;
    throw err;
  }

  const existing = await productRepo.getProductByCode(product_code);
  if (existing) {
    const err = new Error('Product already exists');
    err.statusCode = 409;
    throw err;
  }

  if (payload.uom_code) {
    const uom = await uomRepo.getUomByCode(payload.uom_code);
    if (!uom) {
      const err = new Error('Invalid UOM');
      err.statusCode = 400;
      throw err;
    }
  }

  return productRepo.createProduct(payload);
};

export const getProducts = async () => {
  return productRepo.getProducts();
};

export const getProductByCode = async (code) => {
  const product = await productRepo.getProductByCode(code);

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  return product;
};

export const updateProduct = async (code, payload) => {
  if (!payload.updated_by) {
    const err = new Error('updated_by is required');
    err.statusCode = 400;
    throw err;
  }

  const existing = await productRepo.getProductByCode(code);
  if (!existing) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const updatedData = {
    product_name: payload.product_name ?? existing.product_name,
    category: payload.category ?? existing.category,
    uom_code: payload.uom_code ?? existing.uom_code,
    tax_category: payload.tax_category ?? existing.tax_category,
    packaging: payload.packaging ?? existing.packaging,
    status: payload.status ?? existing.status,
    updated_by: payload.updated_by,
  };

  const updated = await productRepo.updateProduct(code, updatedData);

  if (!updated) {
    const err = new Error('Product update failed');
    err.statusCode = 500;
    throw err;
  }
};

export const deleteProduct = async (code) => {
  const deleted = await productRepo.deleteProduct(code);

  if (!deleted) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
};
