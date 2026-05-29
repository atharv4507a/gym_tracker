import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.js';
import Workout from './backend/models/Workout.js';
import Meal from './backend/models/Meal.js';

const ATLAS_URI = 'mongodb://atharvapawar0860_db_user:06nQsfpFuVdp0QPh@ac-7vfnzag-shard-00-00.j8vmxyc.mongodb.net:27017,ac-7vfnzag-shard-00-01.j8vmxyc.mongodb.net:27017,ac-7vfnzag-shard-00-02.j8vmxyc.mongodb.net:27017/gym_tracker?ssl=true&replicaSet=atlas-7vfnzag-shard-0&authSource=admin&retryWrites=true&w=majority';

async function seedAtlas() {
  try {
    console.log('Connecting to Atlas...');
    await mongoose.connect(ATLAS_URI);
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Meal.deleteMany({});

    console.log('Creating Admin User...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@irontrack.com',
      password: hashedPassword,
      role: 'admin',
      fitness_goal: 'general'
    });

    console.log('✅ Admin user created successfully! (admin@irontrack.com / admin123)');
    console.log('Now you can login on Vercel.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Atlas:', error);
    process.exit(1);
  }
}

seedAtlas();
