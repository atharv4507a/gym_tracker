import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';
import Workout from './backend/models/Workout.js';
import Meal from './backend/models/Meal.js';

dotenv.config();

const fixUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker');
    console.log('MongoDB Connected');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin found');
      process.exit(0);
    }

    const adminWorkouts = await Workout.find({ user: adminUser._id });
    const adminMeals = await Meal.find({ user: adminUser._id });

    const users = await User.find({ role: 'user' });

    for (const user of users) {
      const userWorkoutsCount = await Workout.countDocuments({ user: user._id });
      if (userWorkoutsCount === 0 && adminWorkouts.length > 0) {
        console.log(`Copying workouts for user: ${user.email}`);
        const newWorkouts = adminWorkouts.map(w => {
          const obj = w.toObject();
          delete obj._id;
          delete obj.createdAt;
          delete obj.updatedAt;
          delete obj.__v;
          obj.user = user._id;
          return obj;
        });
        await Workout.insertMany(newWorkouts);
      }

      const userMealsCount = await Meal.countDocuments({ user: user._id });
      if (userMealsCount === 0 && adminMeals.length > 0) {
        console.log(`Copying meals for user: ${user.email}`);
        const newMeals = adminMeals.map(m => {
          const obj = m.toObject();
          delete obj._id;
          delete obj.createdAt;
          delete obj.updatedAt;
          delete obj.__v;
          obj.user = user._id;
          return obj;
        });
        await Meal.insertMany(newMeals);
      }
    }

    console.log('Done fixing users');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixUsers();
