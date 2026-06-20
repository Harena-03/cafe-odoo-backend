const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    const product = new Product({
      name,
      price,
      category,
      description
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();

    res.json({
      message: "All products fetched",
      products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Product updated",
      updatedProduct
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;