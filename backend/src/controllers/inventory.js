import {
  getAllInventory,
  getInventoryCount,
  addInventory,
  updateInventory,
  deleteInventory
} from '../repositories/inventory.js';

export const getInventory = async (req, res) => {
  try {
    const data = await getAllInventory();
    const count = await getInventoryCount();
    res.json({ count, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    const id = await addInventory(req.body);
    res.status(201).json({ message: 'Created successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInventoryController = async (req, res) => {
  try {
    const { txn_code } = req.params;
    const affected = await updateInventory(txn_code, req.body);

    if (affected === 0)
      return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInventoryController = async (req, res) => {
  try {
    const { txn_code } = req.params;
    const affected = await deleteInventory(txn_code);

    if (affected === 0)
      return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
