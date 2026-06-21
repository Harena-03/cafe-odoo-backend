const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true
    },
    seats: {
      type: Number,
      required: [true, 'Seats are required'],
      min: [1, 'Seats must be at least 1']
    },
    floor: {
      type: String,
      trim: true,
      default: 'Ground Floor'
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Reserved'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

tableSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Table', tableSchema);
