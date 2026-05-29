import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';
import Workout from './backend/models/Workout.js';
import Meal from './backend/models/Meal.js';

dotenv.config();

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ============ GOAL TEMPLATES ============

const goalTemplates = {
  weight_loss: {
    workouts: [
      { day: 'Monday', muscle_group: 'Cardio + Full Body', exercises: [
        { name: 'Jumping Jacks', sets: 3, reps: '30', weight: '-' },
        { name: 'Burpees', sets: 3, reps: '15', weight: '-' },
        { name: 'Mountain Climbers', sets: 3, reps: '20', weight: '-' },
        { name: 'High Knees', sets: 3, reps: '30 sec', weight: '-' },
      ]},
      { day: 'Wednesday', muscle_group: 'HIIT Circuit', exercises: [
        { name: 'Jump Squats', sets: 4, reps: '20', weight: '-' },
        { name: 'Push-Ups', sets: 3, reps: '15', weight: '-' },
        { name: 'Plank', sets: 3, reps: '45 sec', weight: '-' },
        { name: 'Skipping Rope', sets: 4, reps: '1 min', weight: '-' },
      ]},
      { day: 'Friday', muscle_group: 'Lower Body + Core', exercises: [
        { name: 'Bodyweight Squats', sets: 4, reps: '25', weight: '-' },
        { name: 'Lunges', sets: 3, reps: '20', weight: '-' },
        { name: 'Crunches', sets: 4, reps: '20', weight: '-' },
        { name: 'Leg Raises', sets: 3, reps: '15', weight: '-' },
      ]},
    ],
    meals: [
      { day: 'Monday', meal_type: 'Breakfast', foods: [
        { name: 'Boiled Eggs (2)', calories: 140, protein: 12, carbs: 1, fats: 10 },
        { name: 'Oats with Water (small bowl)', calories: 150, protein: 5, carbs: 27, fats: 3 },
        { name: 'Green Tea', calories: 5, protein: 0, carbs: 1, fats: 0 },
      ]},
      { day: 'Monday', meal_type: 'Lunch', foods: [
        { name: 'Grilled Chicken (150g)', calories: 250, protein: 35, carbs: 0, fats: 10 },
        { name: 'Chapati (1 poli)', calories: 70, protein: 2, carbs: 15, fats: 1 },
        { name: 'Salad (Cucumber + Tomato)', calories: 30, protein: 1, carbs: 6, fats: 0 },
      ]},
      { day: 'Monday', meal_type: 'Dinner', foods: [
        { name: 'Dal (kali dal - low oil)', calories: 130, protein: 8, carbs: 20, fats: 2 },
        { name: 'Chapati (1 poli)', calories: 70, protein: 2, carbs: 15, fats: 1 },
        { name: 'Stir-fry Vegetables', calories: 80, protein: 2, carbs: 12, fats: 3 },
      ]},
    ],
  },

  muscle_gain: {
    workouts: [
      { day: 'Monday', muscle_group: 'Chest + Triceps', exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', weight: '60kg' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10', weight: '22kg' },
        { name: 'Cable Flyes', sets: 3, reps: '12', weight: '15kg' },
        { name: 'Tricep Dips', sets: 3, reps: '12', weight: 'Bodyweight' },
        { name: 'Skull Crushers', sets: 3, reps: '10', weight: '25kg' },
      ]},
      { day: 'Tuesday', muscle_group: 'Back + Biceps', exercises: [
        { name: 'Deadlift', sets: 4, reps: '6-8', weight: '80kg' },
        { name: 'Pull-Ups', sets: 4, reps: '8', weight: 'Bodyweight' },
        { name: 'Bent Over Row', sets: 3, reps: '10', weight: '50kg' },
        { name: 'Barbell Curls', sets: 3, reps: '12', weight: '25kg' },
        { name: 'Hammer Curls', sets: 3, reps: '12', weight: '12kg' },
      ]},
      { day: 'Thursday', muscle_group: 'Legs', exercises: [
        { name: 'Barbell Squat', sets: 4, reps: '8', weight: '80kg' },
        { name: 'Leg Press', sets: 3, reps: '12', weight: '120kg' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10', weight: '60kg' },
        { name: 'Calf Raises', sets: 4, reps: '20', weight: '40kg' },
      ]},
      { day: 'Saturday', muscle_group: 'Shoulders + Core', exercises: [
        { name: 'Overhead Press', sets: 4, reps: '8-10', weight: '40kg' },
        { name: 'Lateral Raises', sets: 3, reps: '15', weight: '10kg' },
        { name: 'Face Pulls', sets: 3, reps: '15', weight: '20kg' },
        { name: 'Plank', sets: 3, reps: '60 sec', weight: '-' },
        { name: 'Cable Crunches', sets: 3, reps: '15', weight: '30kg' },
      ]},
    ],
    meals: [
      { day: 'Monday', meal_type: 'Breakfast', foods: [
        { name: 'Eggs Scrambled (4 ande)', calories: 280, protein: 24, carbs: 2, fats: 20 },
        { name: 'Bread / Pav (2 slices)', calories: 140, protein: 5, carbs: 28, fats: 2 },
        { name: 'Banana (2)', calories: 210, protein: 2, carbs: 54, fats: 0 },
        { name: 'Whole Milk (1 glass)', calories: 150, protein: 8, carbs: 12, fats: 8 },
      ]},
      { day: 'Monday', meal_type: 'Lunch', foods: [
        { name: 'Chicken Curry (200g)', calories: 350, protein: 40, carbs: 8, fats: 18 },
        { name: 'Rice (2 katori)', calories: 260, protein: 5, carbs: 56, fats: 0 },
        { name: 'Dal Tadka', calories: 130, protein: 7, carbs: 18, fats: 4 },
        { name: 'Chapati (2)', calories: 140, protein: 4, carbs: 30, fats: 2 },
      ]},
      { day: 'Monday', meal_type: 'Snack', foods: [
        { name: 'Peanut Butter Toast (2 slices)', calories: 280, protein: 10, carbs: 30, fats: 14 },
        { name: 'Boiled Eggs (2)', calories: 140, protein: 12, carbs: 1, fats: 10 },
      ]},
      { day: 'Monday', meal_type: 'Dinner', foods: [
        { name: 'Paneer Bhurji (150g)', calories: 300, protein: 18, carbs: 5, fats: 22 },
        { name: 'Chapati (3 poli)', calories: 210, protein: 6, carbs: 45, fats: 3 },
        { name: 'Mixed Vegetable Sabzi', calories: 100, protein: 3, carbs: 14, fats: 4 },
      ]},
    ],
  },

  weight_gain: {
    workouts: [
      { day: 'Monday', muscle_group: 'Chest + Triceps (Heavy)', exercises: [
        { name: 'Bench Press', sets: 5, reps: '5', weight: '80kg' },
        { name: 'Dumbbell Press', sets: 4, reps: '8', weight: '30kg' },
        { name: 'Dips (Weighted)', sets: 3, reps: '8', weight: '+10kg' },
        { name: 'Close Grip Bench', sets: 3, reps: '8', weight: '50kg' },
      ]},
      { day: 'Wednesday', muscle_group: 'Back + Biceps (Heavy)', exercises: [
        { name: 'Deadlift', sets: 5, reps: '5', weight: '100kg' },
        { name: 'Weighted Pull-Ups', sets: 4, reps: '6', weight: '+10kg' },
        { name: 'T-Bar Row', sets: 4, reps: '8', weight: '60kg' },
        { name: 'EZ-Bar Curls', sets: 4, reps: '10', weight: '30kg' },
      ]},
      { day: 'Friday', muscle_group: 'Legs (Heavy)', exercises: [
        { name: 'Barbell Squat', sets: 5, reps: '5', weight: '100kg' },
        { name: 'Leg Press', sets: 4, reps: '10', weight: '150kg' },
        { name: 'Hack Squat', sets: 3, reps: '10', weight: '80kg' },
        { name: 'Seated Calf Raises', sets: 4, reps: '15', weight: '50kg' },
      ]},
    ],
    meals: [
      { day: 'Monday', meal_type: 'Breakfast', foods: [
        { name: 'Eggs (5 - poached or scrambled)', calories: 350, protein: 30, carbs: 2, fats: 25 },
        { name: 'Bread Buttered (3 slices)', calories: 270, protein: 6, carbs: 36, fats: 12 },
        { name: 'Banana (2)', calories: 210, protein: 2, carbs: 54, fats: 0 },
        { name: 'Full Fat Milk (1 big glass)', calories: 200, protein: 10, carbs: 14, fats: 10 },
      ]},
      { day: 'Monday', meal_type: 'Lunch', foods: [
        { name: 'Mutton/Chicken Curry (250g)', calories: 450, protein: 45, carbs: 8, fats: 25 },
        { name: 'Rice (3 katori)', calories: 390, protein: 7, carbs: 84, fats: 0 },
        { name: 'Chapati (2)', calories: 140, protein: 4, carbs: 30, fats: 2 },
        { name: 'Raita', calories: 80, protein: 4, carbs: 8, fats: 3 },
      ]},
      { day: 'Monday', meal_type: 'Snack', foods: [
        { name: 'Mixed Dry Fruits (almond, kaju, akhrot)', calories: 300, protein: 8, carbs: 18, fats: 24 },
        { name: 'Peanut Butter (2 tbsp)', calories: 200, protein: 8, carbs: 6, fats: 16 },
        { name: 'Banana (1)', calories: 105, protein: 1, carbs: 27, fats: 0 },
      ]},
      { day: 'Monday', meal_type: 'Dinner', foods: [
        { name: 'Dal Makhani (full bowl)', calories: 280, protein: 12, carbs: 30, fats: 12 },
        { name: 'Paneer (100g)', calories: 260, protein: 18, carbs: 4, fats: 20 },
        { name: 'Chapati (3 poli)', calories: 210, protein: 6, carbs: 45, fats: 3 },
        { name: 'Rice (1 katori)', calories: 130, protein: 2, carbs: 28, fats: 0 },
      ]},
    ],
  },
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker');
    console.log('MongoDB Connected');

    // Step 1: Set goal='general' for all existing workouts & meals (migration)
    await Workout.updateMany({ goal: { $exists: false } }, { $set: { goal: 'general' } });
    await Meal.updateMany({ goal: { $exists: false } }, { $set: { goal: 'general' } });
    await Workout.updateMany({ goal: null }, { $set: { goal: 'general' } });
    await Meal.updateMany({ goal: null }, { $set: { goal: 'general' } });
    console.log('✅ Migrated existing workouts & meals to goal=general');

    // Step 2: Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please run seed.js first.');
      process.exit(1);
    }

    // Step 3: Delete old goal-specific templates (non-general) from admin
    await Workout.deleteMany({ user: adminUser._id, goal: { $ne: 'general' } });
    await Meal.deleteMany({ user: adminUser._id, goal: { $ne: 'general' } });
    console.log('✅ Cleared old goal-specific templates for admin');

    // Step 4: Seed new goal-specific templates for admin
    for (const [goalKey, templates] of Object.entries(goalTemplates)) {
      // Workouts
      for (const w of templates.workouts) {
        await Workout.create({
          user: adminUser._id,
          day_of_week: w.day,
          muscle_group: w.muscle_group,
          exercises: w.exercises,
          goal: goalKey,
          completed: false,
        });
      }

      // Meals - duplicate for all 7 days
      for (const day of DAYS) {
        for (const m of templates.meals) {
          const total_calories = m.foods.reduce((s, f) => s + f.calories, 0);
          const total_protein = m.foods.reduce((s, f) => s + f.protein, 0);
          const total_carbs = m.foods.reduce((s, f) => s + f.carbs, 0);
          const total_fats = m.foods.reduce((s, f) => s + f.fats, 0);
          await Meal.create({
            user: adminUser._id,
            day_of_week: day,
            meal_type: m.meal_type,
            foods: m.foods,
            goal: goalKey,
            consumed: false,
            total_calories,
            total_protein,
            total_carbs,
            total_fats,
          });
        }
      }

      console.log(`✅ Seeded ${goalKey} templates`);
    }

    console.log('\n🎉 All goal templates seeded successfully!');
    console.log('Now users can switch between: weight_loss, muscle_gain, weight_gain, general');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();
