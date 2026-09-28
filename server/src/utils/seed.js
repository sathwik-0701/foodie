require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { categoriesData, restaurantsData, menuItemsData, couponsData } = require('./seedData');

const seedDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodie_db';
  try {
    console.log('[Seed] Connecting to MongoDB:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('[Seed] Database connected. Clearing existing collections...');

    await Category.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Coupon.deleteMany();

    console.log('[Seed] Inserting categories...');
    const insertedCategories = await Category.insertMany(categoriesData.map(({ _id, ...c }) => c));

    console.log('[Seed] Inserting restaurants...');
    const insertedRestaurants = await Restaurant.insertMany(restaurantsData.map(({ _id, ...r }) => r));

    console.log('[Seed] Inserting menu items...');
    const restMap = {};
    insertedRestaurants.forEach((r, idx) => {
      restMap[restaurantsData[idx]._id] = r._id;
    });

    const preparedMenuItems = menuItemsData.map(({ _id, restaurantId, ...item }) => ({
      ...item,
      restaurantId: restMap[restaurantId] || insertedRestaurants[0]._id
    }));

    await MenuItem.insertMany(preparedMenuItems);

    console.log('[Seed] Inserting coupons...');
    await Coupon.insertMany(couponsData.map(({ _id, ...cp }) => cp));

    // Create default Admin & User if not present
    const adminExists = await User.findOne({ email: 'admin@foodie.com' });
    if (!adminExists) {
      await User.create({
        name: 'Foodie Admin',
        email: 'admin@foodie.com',
        password: 'adminpassword123',
        role: 'ADMIN'
      });
      console.log('[Seed] Created default Admin user (admin@foodie.com / adminpassword123)');
    }

    const demoUserExists = await User.findOne({ email: 'user@foodie.com' });
    if (!demoUserExists) {
      await User.create({
        name: 'Demo Customer',
        email: 'user@foodie.com',
        password: 'userpassword123',
        role: 'USER'
      });
      console.log('[Seed] Created default Demo user (user@foodie.com / userpassword123)');
    }

    console.log('[Seed] Database seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
