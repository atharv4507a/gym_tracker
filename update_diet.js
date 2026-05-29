import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';
import Meal from './backend/models/Meal.js';

dotenv.config();

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const simpleMealsTemplate = [
  {
    meal_type: 'Breakfast',
    foods: [
      { name: 'Poha with Peanuts (पोहे)', calories: 250, protein: 6, carbs: 40, fats: 7 },
      { name: 'Boiled Eggs (2 अंडी)', calories: 140, protein: 12, carbs: 1, fats: 10 },
      { name: 'Banana (केळी)', calories: 105, protein: 1, carbs: 27, fats: 0 }
    ]
  },
  {
    meal_type: 'Lunch',
    foods: [
      { name: 'Chapati / Poli (2-3 पोळ्या)', calories: 210, protein: 6, carbs: 45, fats: 2 },
      { name: 'Dal / Varan (वरण)', calories: 120, protein: 7, carbs: 18, fats: 2 },
      { name: 'Green Vegetable / Bhaji', calories: 80, protein: 2, carbs: 10, fats: 4 },
      { name: 'White Rice (भात)', calories: 130, protein: 2, carbs: 28, fats: 0 }
    ]
  },
  {
    meal_type: 'Snack',
    foods: [
      { name: 'Roasted Chana / फुटाणे (मूठभर)', calories: 150, protein: 7, carbs: 20, fats: 5 },
      { name: 'Tea / Coffee (कमी साखरेचा)', calories: 60, protein: 2, carbs: 10, fats: 2 }
    ]
  },
  {
    meal_type: 'Dinner',
    foods: [
      { name: 'Soya Chunks Bhaji / Chicken (सोयाबीन/चिकन)', calories: 220, protein: 22, carbs: 12, fats: 8 },
      { name: 'Chapati / Poli (2 पोळ्या)', calories: 140, protein: 4, carbs: 30, fats: 1 },
      { name: 'Salad (काकडी, टोमॅटो)', calories: 30, protein: 1, carbs: 6, fats: 0 }
    ]
  }
];

const updateDiet = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker');
    console.log('MongoDB Connected');

    // 1. Delete all existing meals
    await Meal.deleteMany();
    console.log('Deleted old standard meals');

    // 2. Fetch all users
    const users = await User.find();

    // 3. Create simple meals for all users
    const newMealsToInsert = [];

    for (const user of users) {
      DAYS.forEach(day => {
        simpleMealsTemplate.forEach(template => {
          let total_calories = 0;
          let total_protein = 0;
          let total_carbs = 0;
          let total_fats = 0;

          template.foods.forEach(f => {
            total_calories += f.calories;
            total_protein += f.protein;
            total_carbs += f.carbs;
            total_fats += f.fats;
          });

          newMealsToInsert.push({
            user: user._id,
            day_of_week: day,
            meal_type: template.meal_type,
            consumed: false,
            foods: template.foods,
            total_calories,
            total_protein,
            total_carbs,
            total_fats
          });
        });
      });
    }

    await Meal.insertMany(newMealsToInsert);
    console.log('Successfully inserted simple everyday meals for all users!');
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateDiet();
