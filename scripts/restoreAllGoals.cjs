const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const connectDB = require('../backend/config/db');

const User = require('../backend/models/User');
const Workout = require('../backend/models/Workout');
const Meal = require('../backend/models/Meal');

async function restoreAllGoals() {
  await connectDB();

  const user = await User.findOne({ email: 'atharv@gmail.com' });
  const admin = await User.findOne({ role: 'admin' });

  if (!user) { console.log('User not found'); process.exit(1); }
  if (!admin) { console.log('Admin not found'); process.exit(1); }

  // Delete existing workouts/meals for this user
  await Workout.deleteMany({ user: user._id });
  await Meal.deleteMany({ user: user._id });

  for (const goal of ['general', 'weight_loss', 'muscle_gain', 'weight_gain']) {
    const adminWorkouts = await Workout.find({ user: admin._id, goal });
    if (adminWorkouts.length > 0) {
      const newWorkouts = adminWorkouts.map(w => {
        const obj = w.toObject();
        delete obj._id; delete obj.createdAt; delete obj.updatedAt; delete obj.__v;
        obj.user = user._id;
        return obj;
      });
      await Workout.insertMany(newWorkouts);
      console.log(`Copied ${newWorkouts.length} ${goal} workouts`);
    }

    const adminMeals = await Meal.find({ user: admin._id, goal });
    if (adminMeals.length > 0) {
      const newMeals = adminMeals.map(m => {
        const obj = m.toObject();
        delete obj._id; delete obj.createdAt; delete obj.updatedAt; delete obj.__v;
        obj.user = user._id;
        return obj;
      });
      await Meal.insertMany(newMeals);
      console.log(`Copied ${newMeals.length} ${goal} meals`);
    }
  }

  console.log('Done! All goals restored for atharv@gmail.com');
  process.exit(0);
}

restoreAllGoals().catch(err => { console.error(err); process.exit(1); });
