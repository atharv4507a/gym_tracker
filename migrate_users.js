import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';

dotenv.config();

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker');
  console.log('Connected');

  // Set fitness_goal for all users who don't have it
  const result = await User.updateMany(
    { fitness_goal: { $exists: false } },
    { $set: { fitness_goal: 'general' } }
  );
  console.log(`✅ Updated ${result.modifiedCount} users with fitness_goal=general`);

  // Also update any nulls
  const result2 = await User.updateMany(
    { fitness_goal: null },
    { $set: { fitness_goal: 'general' } }
  );
  console.log(`✅ Fixed ${result2.modifiedCount} users with null fitness_goal`);

  process.exit(0);
};

migrate().catch(e => { console.error(e); process.exit(1); });
