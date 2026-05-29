import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Meal from '../models/Meal.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // First user is admin
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({
      email,
      password,
      role,
    });

    if (user) {
      if (role === 'user') {
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) {
          for (const goal of ['general', 'weight_loss', 'muscle_gain', 'weight_gain']) {
            const adminWorkouts = await Workout.find({ user: adminUser._id, goal });
            if (adminWorkouts.length > 0) {
              const newWorkouts = adminWorkouts.map(w => {
                const obj = w.toObject();
                delete obj._id; delete obj.createdAt; delete obj.updatedAt; delete obj.__v;
                obj.user = user._id;
                return obj;
              });
              await Workout.insertMany(newWorkouts);
            }
            const adminMeals = await Meal.find({ user: adminUser._id, goal });
            if (adminMeals.length > 0) {
              const newMeals = adminMeals.map(m => {
                const obj = m.toObject();
                delete obj._id; delete obj.createdAt; delete obj.updatedAt; delete obj.__v;
                obj.user = user._id;
                return obj;
              });
              await Meal.insertMany(newMeals);
            }
          }
        }
      }

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        fitness_goal: user.fitness_goal,
        token: generateToken(user._id, user.role, user.email),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/goal', protect, async (req, res) => {
  const { goal } = req.body;
  if (!['general', 'weight_loss', 'muscle_gain', 'weight_gain'].includes(goal)) {
    return res.status(400).json({ message: 'Invalid goal' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fitness_goal = goal;
    await user.save();

    res.json({ message: 'Goal updated successfully', fitness_goal: user.fitness_goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        fitness_goal: user.fitness_goal,
        token: generateToken(user._id, user.role, user.email),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
