import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env'), override: true });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker';

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goal: { type: String, default: 'general' },
  day_of_week: String,
  muscle_group: String,
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    weight: Number,
  }],
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goal: { type: String, default: 'general' },
  day_of_week: String,
  meal_name: String,
  total_calories: Number,
  total_protein: Number,
  total_carbs: Number,
  total_fat: Number,
  consumed: { type: Boolean, default: false },
  foods: [{
    name: String,
    amount: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  }],
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  fitness_goal: { type: String, default: 'general' },
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);
const Meal = mongoose.model('Meal', mealSchema);
const User = mongoose.model('User', userSchema);

async function restoreAllGoals() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected');

  const user = await User.findOne({ email: 'atharv@gmail.com' });
  const admin = await User.findOne({ role: 'admin' });

  if (!user) { console.log('User not found'); process.exit(1); }
  if (!admin) { console.log('Admin not found'); process.exit(1); }

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
