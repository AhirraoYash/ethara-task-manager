import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { connectDB } from '../config/db';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Demo Admin',
      email: 'admin@gmail.com',
      mobile: '1234567890',
      role: 'Admin',
      password: 'password', // Will be hashed by pre-save hook
    });

    console.log('Admin user seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
