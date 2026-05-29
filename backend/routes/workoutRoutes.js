import express from 'express';
import Workout from '../models/Workout.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ day_of_week: 1 });
    // Transform _id to id for frontend compatibility
    const mapped = workouts.map(w => ({ ...w.toObject(), id: w._id.toString() }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { day_of_week, muscle_group, exercises, goal } = req.body;
    const workout = await Workout.create({
      user: req.user.id,
      day_of_week,
      muscle_group,
      exercises,
      goal: goal || 'general'
    });
    res.status(201).json({ ...workout.toObject(), id: workout._id.toString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const { id, completed } = req.body;
    
    // Non-admins can only toggle completion status
    if (req.user.role !== 'admin' && Object.keys(req.body).some(k => k !== 'id' && k !== 'completed')) {
       return res.status(403).json({ message: 'Not authorized to modify workout details' });
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    
    res.json({ ...workout.toObject(), id: workout._id.toString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', protect, admin, async (req, res) => {
  try {
    const { id } = req.body;
    const workout = await Workout.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
