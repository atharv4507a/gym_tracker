import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Trash2, Info } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { getExerciseImage } from '../lib/exerciseImages';
import RestTimer from '../components/RestTimer';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Workouts() {
  const { isAdmin, getToken } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    muscle_group: '',
    exercises: [{ name: '', sets: 3, reps: '10', weight: '' }],
  });

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('/api/workouts', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const addWorkout = async () => {
    if (!formData.muscle_group || formData.exercises.some(e => !e.name)) return;

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setFormData({
        day_of_week: 'Monday',
        muscle_group: '',
        exercises: [{ name: '', sets: 3, reps: '10', weight: '' }],
      });
      fetchWorkouts();
    }
  };

  const toggleComplete = async (workout) => {
    await fetch('/api/workouts', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ id: workout.id, completed: !workout.completed }),
    });
    fetchWorkouts();
  };

  const deleteWorkout = async (id) => {
    if (!isAdmin) return;
    await fetch('/api/workouts', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ id }),
    });
    fetchWorkouts();
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 3, reps: '10', weight: '' }],
    });
  };

  const updateExercise = (idx, field, value) => {
    const updated = [...formData.exercises];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, exercises: updated });
  };

  const removeExercise = (idx) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== idx),
    });
  };

  const workoutsByDay = DAYS.map(day => ({
    day,
    workouts: workouts.filter(w => w.day_of_week === day),
  }));

  const currentDayWorkouts = workoutsByDay.find(d => d.day === selectedDay)?.workouts || [];

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
          WORKOUTS
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
            Add Workout
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
          <p>👁️ View-only mode - Contact admin to modify workouts</p>
        </motion.div>
      )}

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
                <h2>Add Workout</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="form">
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
                  <label>Muscle Group</label>
                  <input
                    type="text"
                    placeholder="e.g., Chest, Back, Legs"
                    value={formData.muscle_group}
                    onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Exercises</label>
                  {formData.exercises.map((ex, idx) => (
                    <div key={idx} className="exercise-row">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={ex.name}
                        onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => updateExercise(idx, 'sets', parseInt(e.target.value))}
                        style={{ width: '80px' }}
                      />
                      <input
                        type="text"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                        style={{ width: '80px' }}
                      />
                      <input
                        type="text"
                        placeholder="Weight"
                        value={ex.weight}
                        onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                        style={{ width: '100px' }}
                      />
                      {formData.exercises.length > 1 && (
                        <button
                          className="btn-icon-danger"
                          onClick={() => removeExercise(idx)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="btn-secondary" onClick={addExercise}>
                    <Plus size={18} /> Add Exercise
                  </button>
                </div>

                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={addWorkout}>
                    Save Workout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              className="exercise-detail-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedExercise(null)}>
                <X size={24} />
              </button>
              
              <div className="exercise-detail-image">
                <img src={getExerciseImage(selectedExercise.name)} alt={selectedExercise.name} />
              </div>
              
              <div className="exercise-detail-info">
                <h2>{selectedExercise.name}</h2>
                <div className="exercise-stats">
                  <div className="stat-box">
                    <span className="stat-label">Sets</span>
                    <span className="stat-value">{selectedExercise.sets}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Reps</span>
                    <span className="stat-value">{selectedExercise.reps}</span>
                  </div>
                  {selectedExercise.weight && (
                    <div className="stat-box">
                      <span className="stat-label">Weight</span>
                      <span className="stat-value">{selectedExercise.weight}</span>
                    </div>
                  )}
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
            {workoutsByDay.find(d => d.day === day)?.workouts && workoutsByDay.find(d => d.day === day).workouts.length > 0 && (
              <span className="workout-count">
                {workoutsByDay.find(d => d.day === day).workouts.length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Workouts for selected day */}
      <div className="workouts-day-view">
        <h2 className="day-title">{selectedDay}</h2>
        {currentDayWorkouts.length === 0 ? (
          <div className="empty-state">
            <p>No workouts planned for {selectedDay}</p>
          </div>
        ) : (
          <div className="workouts-grid">
            {currentDayWorkouts.map((workout, idx) => (
              <motion.div
                key={workout.id}
                className={`workout-card ${workout.completed ? 'completed' : ''}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="workout-header">
                  <div className="workout-muscle">{workout.muscle_group}</div>
                  <div className="workout-actions">
                    <button
                      className={`btn-icon ${workout.completed ? 'active' : ''}`}
                      onClick={() => toggleComplete(workout)}
                    >
                      <Check size={20} />
                    </button>
                    {isAdmin && (
                      <button
                        className="btn-icon-danger"
                        onClick={() => deleteWorkout(workout.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="exercises-list">
                  {workout.exercises.map((ex, i) => (
                    <div 
                      key={i} 
                      className="exercise-item-with-image"
                      onClick={() => setSelectedExercise(ex)}
                    >
                      <div className="exercise-image-thumb">
                        <img src={getExerciseImage(ex.name)} alt={ex.name} />
                      </div>
                      <div className="exercise-content">
                        <div className="exercise-name">
                          {ex.name}
                          <Info size={14} className="info-icon" />
                        </div>
                        <div className="exercise-details">
                          {ex.sets} × {ex.reps} {ex.weight && `@ ${ex.weight}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {workout.completed && <div className="completion-badge">COMPLETED</div>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <RestTimer />
    </motion.div>
  );
}
