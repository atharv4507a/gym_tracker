import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Meal from '../models/Meal.js';
import Progress from '../models/Progress.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generalWorkouts = [
  {
    day_of_week: 'Monday', muscle_group: 'Chest Day', completed: false, goal: 'general',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', weight: '60kg' },
      { name: 'Dumbbell Press', sets: 3, reps: '10', weight: '20kg' },
      { name: 'Cable Crossover', sets: 3, reps: '12', weight: '15kg' },
      { name: 'Push-ups', sets: 3, reps: '15', weight: 'Bodyweight' }
    ]
  },
  {
    day_of_week: 'Tuesday', muscle_group: 'Back Day', completed: false, goal: 'general',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5-8', weight: '100kg' },
      { name: 'Pull-ups', sets: 3, reps: '8-10', weight: 'Bodyweight' },
      { name: 'Barbell Rows', sets: 3, reps: '10', weight: '60kg' },
      { name: 'Lat Pulldown', sets: 3, reps: '12', weight: '50kg' }
    ]
  },
  {
    day_of_week: 'Wednesday', muscle_group: 'Leg Day', completed: false, goal: 'general',
    exercises: [
      { name: 'Squats', sets: 4, reps: '8-10', weight: '80kg' },
      { name: 'Leg Press', sets: 3, reps: '10-12', weight: '150kg' },
      { name: 'Lunges', sets: 3, reps: '12', weight: '20kg' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '60kg' }
    ]
  },
  {
    day_of_week: 'Thursday', muscle_group: 'Shoulder Day', completed: false, goal: 'general',
    exercises: [
      { name: 'Shoulder Press', sets: 4, reps: '8-10', weight: '40kg' },
      { name: 'Lateral Raises', sets: 4, reps: '12-15', weight: '10kg' },
      { name: 'Front Raises', sets: 3, reps: '12', weight: '10kg' },
      { name: 'Face Pulls', sets: 3, reps: '15', weight: '20kg' }
    ]
  },
  {
    day_of_week: 'Friday', muscle_group: 'Arm Day', completed: false, goal: 'general',
    exercises: [
      { name: 'Bicep Curls', sets: 3, reps: '12', weight: '15kg' },
      { name: 'Hammer Curls', sets: 3, reps: '12', weight: '15kg' },
      { name: 'Tricep Dips', sets: 3, reps: '10', weight: 'Bodyweight' },
      { name: 'Tricep Pushdown', sets: 3, reps: '15', weight: '20kg' }
    ]
  },
  {
    day_of_week: 'Saturday', muscle_group: 'Core & Cardio', completed: false, goal: 'general',
    exercises: [
      { name: 'Plank', sets: 3, reps: '60 secs', weight: 'Bodyweight' },
      { name: 'Crunches', sets: 3, reps: '20', weight: 'Bodyweight' },
      { name: 'Russian Twists', sets: 3, reps: '20', weight: 'Bodyweight' },
      { name: 'Running', sets: 1, reps: '20 mins', weight: 'Bodyweight' }
    ]
  },
  {
    day_of_week: 'Sunday', muscle_group: 'Rest Day', completed: false, goal: 'general',
    exercises: []
  }
];

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

export const autoSeed = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      console.log('Database already has admin user. Skipping auto-seed.');
      return;
    }

    console.log('🚀 No admin user found. Initiating auto-seed process...');

    // 1. Create admin user (using clean schema interface; hook will hash the password)
    const adminUser = await User.create({
      email: 'admin@irontrack.com',
      password: 'admin123',
      role: 'admin',
      fitness_goal: 'general'
    });

    const adminId = adminUser._id;
    console.log(`✅ Admin user created: ${adminUser.email} (ID: ${adminId})`);

    // 2. Seed general workouts
    const workoutsToInsert = generalWorkouts.map(w => ({
      ...w,
      user: adminId
    }));
    await Workout.insertMany(workoutsToInsert);
    console.log('✅ Seeded general workouts for admin');

    // 3. Seed general meals for all 7 days
    const mealsToInsert = [];
    DAYS.forEach(day => {
      mealsToInsert.push(
        {
          user: adminId, day_of_week: day, meal_type: 'Breakfast', consumed: false, goal: 'general',
          foods: [
            { name: 'Oats with milk and whey protein', calories: 450, protein: 35, carbs: 55, fats: 10 },
            { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 }
          ],
          total_calories: 555, total_protein: 36, total_carbs: 82, total_fats: 10
        },
        {
          user: adminId, day_of_week: day, meal_type: 'Lunch', consumed: false, goal: 'general',
          foods: [
            { name: 'Chicken breast (200g)', calories: 330, protein: 62, carbs: 0, fats: 7 },
            { name: 'Brown Rice (150g)', calories: 168, protein: 4, carbs: 35, fats: 1 },
            { name: 'Broccoli', calories: 35, protein: 2, carbs: 7, fats: 0 }
          ],
          total_calories: 533, total_protein: 68, total_carbs: 42, total_fats: 8
        },
        {
          user: adminId, day_of_week: day, meal_type: 'Snack', consumed: false, goal: 'general',
          foods: [
            { name: 'Almonds (30g)', calories: 164, protein: 6, carbs: 6, fats: 14 },
            { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 4, fats: 0 }
          ],
          total_calories: 264, total_protein: 23, total_carbs: 10, total_fats: 14
        },
        {
          user: adminId, day_of_week: day, meal_type: 'Dinner', consumed: false, goal: 'general',
          foods: [
            { name: 'Salmon (150g)', calories: 312, protein: 30, carbs: 0, fats: 20 },
            { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fats: 0 }
          ],
          total_calories: 424, total_protein: 32, total_carbs: 26, total_fats: 20
        }
      );
    });
    await Meal.insertMany(mealsToInsert);
    console.log('✅ Seeded general meals for admin');

    // 4. Seed goal templates (weight_loss, muscle_gain, weight_gain)
    for (const [goalKey, templates] of Object.entries(goalTemplates)) {
      // Workouts
      const goalWorkouts = templates.workouts.map(w => ({
        user: adminId,
        day_of_week: w.day,
        muscle_group: w.muscle_group,
        exercises: w.exercises,
        goal: goalKey,
        completed: false,
      }));
      await Workout.insertMany(goalWorkouts);

      // Meals (duplicated for all 7 days)
      const goalMeals = [];
      for (const day of DAYS) {
        templates.meals.forEach(m => {
          const total_calories = m.foods.reduce((s, f) => s + f.calories, 0);
          const total_protein = m.foods.reduce((s, f) => s + f.protein, 0);
          const total_carbs = m.foods.reduce((s, f) => s + f.carbs, 0);
          const total_fats = m.foods.reduce((s, f) => s + f.fats, 0);
          
          goalMeals.push({
            user: adminId,
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
        });
      }
      await Meal.insertMany(goalMeals);
      console.log(`✅ Seeded ${goalKey} workouts & meals for admin`);
    }

    // 5. Seed initial progress entries for admin
    const today = new Date();
    const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const progress = [
      { user: adminId, date: twoWeeksAgo, weight: 78.5, body_fat: 16.5, notes: 'Started proper diet' },
      { user: adminId, date: lastWeek, weight: 77.2, body_fat: 16.0, notes: 'Consistent workouts' },
      { user: adminId, date: today, weight: 76.0, body_fat: 15.5, notes: 'Feeling much stronger' }
    ];
    await Progress.insertMany(progress);
    console.log('✅ Seeded initial progress entries for admin');
    
    console.log('🎉 Auto-seed process completed successfully!');
  } catch (error) {
    console.error('❌ Auto-seed process failed:', error);
  }
};
