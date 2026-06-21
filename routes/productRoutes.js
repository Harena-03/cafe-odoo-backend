const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// Create new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, category, description, unitOfMeasure, tax } = req.body;
    const product = new Product({
      name,
      price,
      category,
      description,
      unitOfMeasure,
      tax
    });
    await product.save();
    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update product by id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete product by id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
