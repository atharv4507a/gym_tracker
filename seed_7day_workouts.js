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
      { day: 'Tuesday', muscle_group: 'Core + HIIT', exercises: [
        { name: 'Plank', sets: 4, reps: '45 sec', weight: '-' },
        { name: 'Russian Twists', sets: 3, reps: '20', weight: '-' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20', weight: '-' },
        { name: 'Jump Rope', sets: 4, reps: '1 min', weight: '-' },
      ]},
      { day: 'Wednesday', muscle_group: 'Lower Body Focus', exercises: [
        { name: 'Jump Squats', sets: 4, reps: '20', weight: '-' },
        { name: 'Lunges', sets: 3, reps: '15 per leg', weight: '-' },
        { name: 'Glute Bridges', sets: 3, reps: '20', weight: '-' },
        { name: 'Wall Sit', sets: 3, reps: '45 sec', weight: '-' },
      ]},
      { day: 'Thursday', muscle_group: 'Active Recovery (Yoga/Stretch)', exercises: [
        { name: 'Cat-Cow Stretch', sets: 2, reps: '10', weight: '-' },
        { name: 'Downward Dog', sets: 2, reps: '30 sec', weight: '-' },
        { name: 'Childs Pose', sets: 2, reps: '1 min', weight: '-' },
        { name: 'Light Jogging', sets: 1, reps: '15 mins', weight: '-' },
      ]},
      { day: 'Friday', muscle_group: 'Upper Body Circuit', exercises: [
        { name: 'Push-Ups', sets: 4, reps: '12', weight: '-' },
        { name: 'Tricep Dips (on chair)', sets: 3, reps: '15', weight: '-' },
        { name: 'Plank Shoulder Taps', sets: 3, reps: '20', weight: '-' },
        { name: 'Shadow Boxing', sets: 3, reps: '1 min', weight: '-' },
      ]},
      { day: 'Saturday', muscle_group: 'Full Body Sweat', exercises: [
        { name: 'Squat Jumps', sets: 3, reps: '15', weight: '-' },
        { name: 'Push-Ups', sets: 3, reps: '12', weight: '-' },
        { name: 'Burpees', sets: 3, reps: '10', weight: '-' },
        { name: 'Mountain Climbers', sets: 3, reps: '30 sec', weight: '-' },
      ]},
      { day: 'Sunday', muscle_group: 'Light Cardio', exercises: [
        { name: 'Brisk Walking', sets: 1, reps: '30 mins', weight: '-' },
        { name: 'Stretching', sets: 1, reps: '10 mins', weight: '-' },
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
      { day: 'Wednesday', muscle_group: 'Legs (Quads Focus)', exercises: [
        { name: 'Barbell Squat', sets: 4, reps: '8-10', weight: '80kg' },
        { name: 'Leg Press', sets: 3, reps: '12', weight: '120kg' },
        { name: 'Leg Extensions', sets: 3, reps: '15', weight: '40kg' },
        { name: 'Walking Lunges', sets: 3, reps: '20', weight: '15kg' },
      ]},
      { day: 'Thursday', muscle_group: 'Shoulders + Core', exercises: [
        { name: 'Overhead Press', sets: 4, reps: '8-10', weight: '40kg' },
        { name: 'Lateral Raises', sets: 3, reps: '15', weight: '10kg' },
        { name: 'Face Pulls', sets: 3, reps: '15', weight: '20kg' },
        { name: 'Plank', sets: 3, reps: '60 sec', weight: '-' },
        { name: 'Cable Crunches', sets: 3, reps: '15', weight: '30kg' },
      ]},
      { day: 'Friday', muscle_group: 'Chest + Back (Hypertrophy)', exercises: [
        { name: 'Dumbbell Bench Press', sets: 4, reps: '10', weight: '25kg' },
        { name: 'Lat Pulldown', sets: 4, reps: '10', weight: '55kg' },
        { name: 'Pec Deck Machine', sets: 3, reps: '12', weight: '40kg' },
        { name: 'Seated Cable Row', sets: 3, reps: '12', weight: '50kg' },
      ]},
      { day: 'Saturday', muscle_group: 'Legs (Hamstrings) + Arms', exercises: [
        { name: 'Romanian Deadlift', sets: 4, reps: '10', weight: '70kg' },
        { name: 'Leg Curls', sets: 3, reps: '12', weight: '35kg' },
        { name: 'Preacher Curls', sets: 3, reps: '10', weight: '20kg' },
        { name: 'Tricep Pushdown', sets: 3, reps: '12', weight: '25kg' },
      ]},
      { day: 'Sunday', muscle_group: 'Active Recovery', exercises: [
        { name: 'Cycling / Walking', sets: 1, reps: '20 mins', weight: '-' },
        { name: 'Foam Rolling', sets: 1, reps: '15 mins', weight: '-' },
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
      { day: 'Tuesday', muscle_group: 'Back + Biceps (Heavy)', exercises: [
        { name: 'Deadlift', sets: 5, reps: '5', weight: '100kg' },
        { name: 'Weighted Pull-Ups', sets: 4, reps: '6', weight: '+10kg' },
        { name: 'T-Bar Row', sets: 4, reps: '8', weight: '60kg' },
        { name: 'EZ-Bar Curls', sets: 4, reps: '10', weight: '30kg' },
      ]},
      { day: 'Wednesday', muscle_group: 'Legs (Heavy)', exercises: [
        { name: 'Barbell Squat', sets: 5, reps: '5', weight: '100kg' },
        { name: 'Leg Press', sets: 4, reps: '10', weight: '150kg' },
        { name: 'Hack Squat', sets: 3, reps: '10', weight: '80kg' },
        { name: 'Seated Calf Raises', sets: 4, reps: '15', weight: '50kg' },
      ]},
      { day: 'Thursday', muscle_group: 'Shoulders (Heavy)', exercises: [
        { name: 'Military Press', sets: 5, reps: '5', weight: '50kg' },
        { name: 'Dumbbell Shoulder Press', sets: 4, reps: '8', weight: '22kg' },
        { name: 'Upright Row', sets: 3, reps: '10', weight: '35kg' },
        { name: 'Shrugs', sets: 4, reps: '12', weight: '80kg' },
      ]},
      { day: 'Friday', muscle_group: 'Full Upper Body', exercises: [
        { name: 'Incline Bench Press', sets: 4, reps: '8', weight: '60kg' },
        { name: 'Barbell Row', sets: 4, reps: '8', weight: '60kg' },
        { name: 'Overhead Press', sets: 3, reps: '10', weight: '40kg' },
        { name: 'Barbell Curls', sets: 3, reps: '10', weight: '30kg' },
      ]},
      { day: 'Saturday', muscle_group: 'Full Lower Body', exercises: [
        { name: 'Front Squat', sets: 4, reps: '8', weight: '70kg' },
        { name: 'Romanian Deadlift', sets: 4, reps: '8', weight: '80kg' },
        { name: 'Walking Lunges', sets: 3, reps: '12 per leg', weight: '20kg' },
        { name: 'Standing Calf Raises', sets: 4, reps: '15', weight: '80kg' },
      ]},
      { day: 'Sunday', muscle_group: 'Rest / Core', exercises: [
        { name: 'Plank', sets: 3, reps: '60 sec', weight: '-' },
        { name: 'Hanging Leg Raises', sets: 3, reps: '15', weight: 'Bodyweight' },
        { name: 'Light Stretching', sets: 1, reps: '10 mins', weight: '-' },
      ]},
    ],
  },
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_tracker');
    console.log('MongoDB Connected');

    // Step 1: Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please run seed.js first.');
      process.exit(1);
    }

    // Step 2: Delete old goal-specific WORKOUTS only from admin (keep meals)
    await Workout.deleteMany({ user: adminUser._id, goal: { $in: ['weight_loss', 'muscle_gain', 'weight_gain'] } });
    console.log('✅ Cleared old goal-specific workouts for admin');

    // Step 3: Seed new 7-day workouts for admin
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
      console.log(`✅ Seeded ${goalKey} 7-day workouts`);
    }

    // Now update existing users if they have a non-general goal to get the new workouts
    const users = await User.find({ fitness_goal: { $in: ['weight_loss', 'muscle_gain', 'weight_gain'] } });
    
    for (const user of users) {
      // Delete old workouts for their goal
      await Workout.deleteMany({ user: user._id });
      
      // Copy new workouts from admin
      const adminWorkouts = await Workout.find({ user: adminUser._id, goal: user.fitness_goal });
      if (adminWorkouts.length > 0) {
        const newWorkouts = adminWorkouts.map(w => {
          const obj = w.toObject();
          delete obj._id; delete obj.createdAt; delete obj.updatedAt; delete obj.__v;
          obj.user = user._id;
          return obj;
        });
        await Workout.insertMany(newWorkouts);
      }
      console.log(`✅ Updated workouts for user: ${user.email} (${user.fitness_goal})`);
    }

    console.log('\n🎉 7-day Workouts seeded and users updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();
