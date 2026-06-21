const express = require('express');
const router = express.Router();

const Table = require('../models/Table');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new table
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { number, seats, floor, status } = req.body;
    const table = new Table({ number, seats, floor, status });
    await table.save();
    return res.status(201).json({ message: 'Table created successfully', table });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    return res.json({ message: 'Tables fetched successfully', tables });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update table by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    return res.json({ message: 'Table updated successfully', table });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete table by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    return res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
