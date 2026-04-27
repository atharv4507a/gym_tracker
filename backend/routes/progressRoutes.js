import express from 'express';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).sort({ date: -1 }).limit(30);
    const mapped = progress.map(p => ({ ...p.toObject(), id: p._id.toString() }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { date, weight, body_fat, notes } = req.body;
    const progress = await Progress.create({
      user: req.user.id,
      date,
      weight,
      body_fat,
      notes
    });
    res.status(201).json({ ...progress.toObject(), id: progress._id.toString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', protect, async (req, res) => {
  try {
    const { id } = req.body;
    const progress = await Progress.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
