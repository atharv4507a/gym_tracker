import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Trash2 } from 'lucide-react';
import { useAuth } from '../lib/auth';
import Toast, { showToast } from '../components/Toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function Diet() {
  const { isAdmin, getToken } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [filterGoal, setFilterGoal] = useState('general');
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    meal_type: 'Breakfast',
    goal: 'general',
    foods: [{ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }],
  });

  const fetchMeals = async () => {
    try {
      const res = await fetch('/api/meals', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const addMeal = async () => {
    if (formData.foods.some(f => !f.name)) return;

    const totals = formData.foods.reduce(
      (acc, f) => ({
        total_calories: acc.total_calories + f.calories,
        total_protein: acc.total_protein + f.protein,
        total_carbs: acc.total_carbs + f.carbs,
        total_fats: acc.total_fats + f.fats,
      }),
      { total_calories: 0, total_protein: 0, total_carbs: 0, total_fats: 0 }
    );

    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ ...formData, ...totals }),
    });

    if (res.ok) {
      setShowForm(false);
      setFormData({
        day_of_week: 'Monday',
        meal_type: 'Breakfast',
        goal: formData.goal,
        foods: [{ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }],
      });
      fetchMeals();
    }
  };

  const toggleConsumed = async (meal) => {
    const newStatus = !meal.consumed;
    await fetch('/api/meals', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ id: meal.id, consumed: newStatus }),
    });
    showToast(newStatus ? 'Meal consumed! 🍽️' : 'Meal unmarked');
    fetchMeals();
  };

  const deleteMeal = async (id) => {
    if (!isAdmin) return;
    await fetch('/api/meals', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ id }),
    });
    fetchMeals();
  };

  const addFood = () => {
    setFormData({
      ...formData,
      foods: [...formData.foods, { name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }],
    });
  };

  const updateFood = (idx, field, value) => {
    const updated = [...formData.foods];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, foods: updated });
  };

  const removeFood = (idx) => {
    setFormData({
      ...formData,
      foods: formData.foods.filter((_, i) => i !== idx),
    });
  };

  const filteredMeals = meals.filter(m => (m.goal || 'general') === filterGoal);

  const mealsByDay = DAYS.map(day => ({
    day,
    meals: filteredMeals.filter(m => m.day_of_week === day),
  }));

  const currentDayMeals = mealsByDay.find(d => d.day === selectedDay)?.meals || [];

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          DIET PLAN
        </motion.h1>
        {isAdmin && (
          <motion.button
            className="btn-primary"
            onClick={() => setShowForm(true)}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add Meal
          </motion.button>
        )}
      </div>

      {!isAdmin && (
        <motion.div
          className="info-banner"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p>👁️ View-only mode - Contact admin to modify meals</p>
        </motion.div>
      )}

      <div className="day-tabs" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
        {['general', 'weight_loss', 'muscle_gain', 'weight_gain'].map(goal => (
          <button
            key={goal}
            className={`day-tab ${filterGoal === goal ? 'active' : ''}`}
            onClick={() => setFilterGoal(goal)}
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            {goal.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add Meal</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Day</label>
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                    >
                      {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Meal Type</label>
                    <select
                      value={formData.meal_type}
                      onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                    >
                      {MEAL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fitness Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    >
                      <option value="general">General</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="weight_gain">Weight Gain</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Foods</label>
                  {formData.foods.map((food, idx) => (
                    <div key={idx} className="food-row">
                      <input
                        type="text"
                        placeholder="Food name"
                        value={food.name}
                        onChange={(e) => updateFood(idx, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Cal"
                        value={food.calories || ''}
                        onChange={(e) => updateFood(idx, 'calories', parseFloat(e.target.value) || 0)}
                        style={{ width: '80px' }}
                      />
                      <input
                        type="number"
                        placeholder="P"
                        value={food.protein || ''}
                        onChange={(e) => updateFood(idx, 'protein', parseFloat(e.target.value) || 0)}
                        style={{ width: '70px' }}
                      />
                      <input
                        type="number"
                        placeholder="C"
                        value={food.carbs || ''}
                        onChange={(e) => updateFood(idx, 'carbs', parseFloat(e.target.value) || 0)}
                        style={{ width: '70px' }}
                      />
                      <input
                        type="number"
                        placeholder="F"
                        value={food.fats || ''}
                        onChange={(e) => updateFood(idx, 'fats', parseFloat(e.target.value) || 0)}
                        style={{ width: '70px' }}
                      />
                      {formData.foods.length > 1 && (
                        <button
                          className="btn-icon-danger"
                          onClick={() => removeFood(idx)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="btn-secondary" onClick={addFood}>
                    <Plus size={18} /> Add Food
                  </button>
                </div>

                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={addMeal}>
                    Save Meal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day Tabs */}
      <div className="day-tabs">
        {DAYS.map((day, idx) => (
          <motion.button
            key={day}
            className={`day-tab ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -2 }}
          >
            {day.substring(0, 3)}
            {mealsByDay.find(d => d.day === day)?.meals && mealsByDay.find(d => d.day === day).meals.length > 0 && (
              <span className="workout-count">
                {mealsByDay.find(d => d.day === day).meals.length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Meals for selected day */}
      <div className="workouts-day-view">
        <h2 className="day-title">{selectedDay}</h2>
        {currentDayMeals.length === 0 ? (
          <div className="empty-state">
            <p>No meals planned for {selectedDay}</p>
          </div>
        ) : (
          <div className="meals-grid">
            {currentDayMeals.map((meal, idx) => (
              <motion.div
                key={meal.id}
                className={`meal-card ${meal.consumed ? 'consumed' : ''}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="meal-header">
                  <div className="meal-type">{meal.meal_type}</div>
                  <div className="meal-actions">
                    <button
                      className={`btn-icon ${meal.consumed ? 'active' : ''}`}
                      onClick={() => toggleConsumed(meal)}
                    >
                      <Check size={20} />
                    </button>
                    {isAdmin && (
                      <button
                        className="btn-icon-danger"
                        onClick={() => deleteMeal(meal.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="foods-list">
                  {meal.foods.map((food, i) => {
                    const parts = food.name.split(' / ');
                    return (
                      <div key={i} className="food-item">
                        <div className="food-name">
                          {parts.length > 1 ? (
                            <><span className="nonveg">{parts[0]}</span><span className="sep"> / </span><span className="vegalternative">{parts[1]}</span></>
                          ) : food.name}
                        </div>
                        <div className="food-macros">
                          {food.calories}cal · P:{food.protein}g · C:{food.carbs}g · F:{food.fats}g
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="meal-totals">
                  <div className="total-item">
                    <span>Total</span>
                    <span>{meal.total_calories} cal</span>
                  </div>
                  <div className="macro-breakdown">
                    <span>P: {meal.total_protein}g</span>
                    <span>C: {meal.total_carbs}g</span>
                    <span>F: {meal.total_fats}g</span>
                  </div>
                </div>

                {meal.consumed && <div className="consumption-badge">CONSUMED</div>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Toast />
    </motion.div>
  );
}
