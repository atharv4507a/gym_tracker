import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.js';
import Workout from './backend/models/Workout.js';
import Meal from './backend/models/Meal.js';
import Progress from './backend/models/Progress.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await Workout.deleteMany();
    await Meal.deleteMany();
    await Progress.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminUser = await User.create({
      email: 'admin@irontrack.com',
      password: 'admin123',
      role: 'admin'
    });

    const adminId = adminUser._id;

    const workouts = [
      {
        user: adminId, day_of_week: 'Monday', muscle_group: 'Chest Day', completed: false,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10', weight: '60kg' },
          { name: 'Dumbbell Press', sets: 3, reps: '10', weight: '20kg' },
          { name: 'Cable Crossover', sets: 3, reps: '12', weight: '15kg' },
          { name: 'Push-ups', sets: 3, reps: '15', weight: 'Bodyweight' }
        ]
      },
      {
        user: adminId, day_of_week: 'Tuesday', muscle_group: 'Back Day', completed: false,
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5-8', weight: '100kg' },
          { name: 'Pull-ups', sets: 3, reps: '8-10', weight: 'Bodyweight' },
          { name: 'Barbell Rows', sets: 3, reps: '10', weight: '60kg' },
          { name: 'Lat Pulldown', sets: 3, reps: '12', weight: '50kg' }
        ]
      },
      {
        user: adminId, day_of_week: 'Wednesday', muscle_group: 'Leg Day', completed: false,
        exercises: [
          { name: 'Squats', sets: 4, reps: '8-10', weight: '80kg' },
          { name: 'Leg Press', sets: 3, reps: '10-12', weight: '150kg' },
          { name: 'Lunges', sets: 3, reps: '12', weight: '20kg' },
          { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '60kg' }
        ]
      },
      {
        user: adminId, day_of_week: 'Thursday', muscle_group: 'Shoulder Day', completed: false,
        exercises: [
          { name: 'Shoulder Press', sets: 4, reps: '8-10', weight: '40kg' },
          { name: 'Lateral Raises', sets: 4, reps: '12-15', weight: '10kg' },
          { name: 'Front Raises', sets: 3, reps: '12', weight: '10kg' },
          { name: 'Face Pulls', sets: 3, reps: '15', weight: '20kg' }
        ]
      },
      {
        user: adminId, day_of_week: 'Friday', muscle_group: 'Arm Day', completed: false,
        exercises: [
          { name: 'Bicep Curls', sets: 3, reps: '12', weight: '15kg' },
          { name: 'Hammer Curls', sets: 3, reps: '12', weight: '15kg' },
          { name: 'Tricep Dips', sets: 3, reps: '10', weight: 'Bodyweight' },
          { name: 'Tricep Pushdown', sets: 3, reps: '15', weight: '20kg' }
        ]
      },
      {
        user: adminId, day_of_week: 'Saturday', muscle_group: 'Core & Cardio', completed: false,
        exercises: [
          { name: 'Plank', sets: 3, reps: '60 secs', weight: 'Bodyweight' },
          { name: 'Crunches', sets: 3, reps: '20', weight: 'Bodyweight' },
          { name: 'Russian Twists', sets: 3, reps: '20', weight: 'Bodyweight' },
          { name: 'Running', sets: 1, reps: '20 mins', weight: 'Bodyweight' }
        ]
      },
      {
        user: adminId, day_of_week: 'Sunday', muscle_group: 'Rest Day', completed: false,
        exercises: []
      }
    ];

    await Workout.insertMany(workouts);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals = [];

    DAYS.forEach(day => {
      meals.push(
        {
          user: adminId, day_of_week: day, meal_type: 'Breakfast', consumed: false,
          foods: [
            { name: 'Oats with milk and whey protein', calories: 450, protein: 35, carbs: 55, fats: 10 },
            { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 }
          ],
          total_calories: 555, total_protein: 36, total_carbs: 82, total_fats: 10
        },
        {
          user: adminId, day_of_week: day, meal_type: 'Lunch', consumed: false,
          foods: [
            { name: 'Chicken breast (200g)', calories: 330, protein: 62, carbs: 0, fats: 7 },
            { name: 'Brown Rice (150g)', calories: 168, protein: 4, carbs: 35, fats: 1 },
            { name: 'Broccoli', calories: 35, protein: 2, carbs: 7, fats: 0 }
          ],
          total_calories: 533, total_protein: 68, total_carbs: 42, total_fats: 8
        },
        {
          user: adminId, day_of_week: day, meal_type: 'Snack', consumed: false,
          foods: [
            { name: 'Almonds (30g)', calories: 164, protein: 6, carbs: 6, fats: 14 },
            { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 4, fats: 0 }
          ],
          total_calories: 264, total_protein: 23, total_carbs: 10, total_fats: 14
        },
        {
          user: adminId, day_of_week: day, meal_type: 'Dinner', consumed: false,
          foods: [
            { name: 'Salmon (150g)', calories: 312, protein: 30, carbs: 0, fats: 20 },
            { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fats: 0 }
          ],
          total_calories: 424, total_protein: 32, total_carbs: 26, total_fats: 20
        }
      );
    });

    await Meal.insertMany(meals);

    const today = new Date();
    const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const progress = [
      { user: adminId, date: twoWeeksAgo, weight: 78.5, body_fat: 16.5, notes: 'Started proper diet' },
      { user: adminId, date: lastWeek, weight: 77.2, body_fat: 16.0, notes: 'Consistent workouts' },
      { user: adminId, date: today, weight: 76.0, body_fat: 15.5, notes: 'Feeling much stronger' }
    ];

    await Progress.insertMany(progress);

    console.log('Detailed Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();