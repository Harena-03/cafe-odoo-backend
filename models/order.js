const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
  tableNumber: {
    type: Number,
    required: true
  },

  products: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model("Order", orderSchema);