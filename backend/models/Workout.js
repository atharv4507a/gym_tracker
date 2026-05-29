import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day_of_week: {
    type: String,
    required: true,
  },
  muscle_group: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    weight: String,
  }],
  goal: {
    type: String,
    enum: ['general', 'weight_loss', 'muscle_gain', 'weight_gain'],
    default: 'general',
  },
}, {
  timestamps: true,
});

// Create index for easy querying by user
workoutSchema.index({ user: 1, day_of_week: 1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
