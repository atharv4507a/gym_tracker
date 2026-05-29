import mongoose from 'mongoose';
import User from './backend/models/User.js';
import Workout from './backend/models/Workout.js';
import Meal from './backend/models/Meal.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/gym_tracker';
const ATLAS_URI = 'mongodb://atharvapawar0860_db_user:06nQsfpFuVdp0QPh@ac-7vfnzag-shard-00-00.j8vmxyc.mongodb.net:27017,ac-7vfnzag-shard-00-01.j8vmxyc.mongodb.net:27017,ac-7vfnzag-shard-00-02.j8vmxyc.mongodb.net:27017/gym_tracker?ssl=true&replicaSet=atlas-7vfnzag-shard-0&authSource=admin&retryWrites=true&w=majority';

async function migrate() {
  try {
    // 1. Connect to Local DB and fetch all data
    console.log('Connecting to Local DB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    
    // Register models on local connection
    const LocalUser = localConn.model('User', User.schema);
    const LocalWorkout = localConn.model('Workout', Workout.schema);
    const LocalMeal = localConn.model('Meal', Meal.schema);

    console.log('Fetching local data...');
    const users = await LocalUser.find({}).lean();
    const workouts = await LocalWorkout.find({}).lean();
    const meals = await LocalMeal.find({}).lean();

    console.log(`Found: ${users.length} users, ${workouts.length} workouts, ${meals.length} meals`);
    await localConn.close();

    // 2. Connect to Atlas DB and insert data
    console.log('\nConnecting to Atlas DB...');
    await mongoose.connect(ATLAS_URI);
    
    console.log('Clearing existing data in Atlas (if any)...');
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Meal.deleteMany({});

    console.log('Inserting data to Atlas...');
    if (users.length > 0) await User.insertMany(users);
    if (workouts.length > 0) await Workout.insertMany(workouts);
    if (meals.length > 0) await Meal.insertMany(meals);

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
