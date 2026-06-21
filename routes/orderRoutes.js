const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.send("Order Route Working");
});
router.post("/create", authMiddleware, createOrder);
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;