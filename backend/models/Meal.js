import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day_of_week: {
    type: String,
    required: true,
  },
  meal_type: {
    type: String,
    required: true,
  },
  consumed: {
    type: Boolean,
    default: false,
  },
  foods: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
  }],
  total_calories: { type: Number, default: 0 },
  total_protein: { type: Number, default: 0 },
  total_carbs: { type: Number, default: 0 },
  total_fats: { type: Number, default: 0 },
  goal: {
    type: String,
    enum: ['general', 'weight_loss', 'muscle_gain', 'weight_gain'],
    default: 'general',
  },
}, {
  timestamps: true,
});

mealSchema.index({ user: 1, day_of_week: 1 });

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;
