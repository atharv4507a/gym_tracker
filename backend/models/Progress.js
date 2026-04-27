import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  body_fat: {
    type: Number,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

progressSchema.index({ user: 1, date: -1 });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
