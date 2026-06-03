import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@ecommerce.com' });
    if (existingAdmin) {
      console.log('✗ Admin already exists with email: admin@ecommerce.com');
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      phone: '9999999999',
      role: 'admin',
      profileImage: null
    });

    await admin.save();
    console.log('✓ Admin account created successfully!');
    console.log('📧 Email: admin@ecommerce.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
