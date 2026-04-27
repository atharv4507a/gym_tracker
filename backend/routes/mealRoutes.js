import express from 'express';
import Meal from '../models/Meal.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ day_of_week: 1, meal_type: 1 });
    const mapped = meals.map(m => ({ ...m.toObject(), id: m._id.toString() }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { day_of_week, meal_type, foods, total_calories, total_protein, total_carbs, total_fats } = req.body;
    const meal = await Meal.create({
      user: req.user.id,
      day_of_week,
      meal_type,
      foods,
      total_calories,
      total_protein,
      total_carbs,
      total_fats
    });
    res.status(201).json({ ...meal.toObject(), id: meal._id.toString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const { id, consumed } = req.body;
    
    // Non-admins can only toggle consumed status
    if (req.user.role !== 'admin' && Object.keys(req.body).some(k => k !== 'id' && k !== 'consumed')) {
       return res.status(403).json({ message: 'Not authorized to modify meal details' });
    }

    const meal = await Meal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    
    res.json({ ...meal.toObject(), id: meal._id.toString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', protect, admin, async (req, res) => {
  try {
    const { id } = req.body;
    const meal = await Meal.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
