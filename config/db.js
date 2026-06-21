const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedDefaults = async () => {
  try {
    const Product = require('../models/Product');
    const Table = require('../models/Table');
    const User = require('../models/User');

    const defaultProducts = [
      { name: 'Masala Dosa', price: 120, category: 'Breakfast', description: 'Crispy dosa with spiced potatoes', unitOfMeasure: 'Per Plate', tax: '5%' },
      { name: 'Cappuccino', price: 90, category: 'Beverages', description: 'Creamy coffee with foam', unitOfMeasure: 'Per Cup', tax: '12%' },
      { name: 'Paneer Butter Masala', price: 240, category: 'Main Course', description: 'Rich paneer curry in creamy tomato sauce', unitOfMeasure: 'Per Plate', tax: '12%' }
    ];

    const defaultTables = [
      { number: 'Table 1', seats: 2, floor: 'Ground Floor', status: 'Available' },
      { number: 'Table 2', seats: 4, floor: 'Ground Floor', status: 'Occupied' },
      { number: 'Table 3', seats: 2, floor: 'Ground Floor', status: 'Available' }
    ];

    const adminEmail = 'admin@odoo.com';

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log('Seeded default products');
    }

    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      await Table.insertMany(defaultTables);
      console.log('Seeded default tables');
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Seeded default admin user: admin@odoo.com / admin123');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cafe');
    console.log('MongoDB Connected');
    await seedDefaults();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
