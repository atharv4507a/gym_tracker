import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

import { useAuth } from '../lib/auth';

export default function Progress() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat: '',
    notes: '',
  });
  const [height, setHeight] = useState(175);

  const calculateBMI = () => {
    if (!entries.length || !height) return '0.0';
    const weight = entries[0].weight;
    const hMeter = height / 100;
    return (weight / (hMeter * hMeter)).toFixed(1);
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIColor = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return '#00ffff';
    if (bmi < 25) return 'var(--neon-green)';
    if (bmi < 30) return '#ffcc00';
    return '#ff4d4d';
  };

  const calculateBMR = () => {
    if (!entries.length || !height) return '0';
    const weight = entries[0].weight;
    // Mifflin-St Jeor Equation (Male version by default)
    return Math.round(10 * weight + 6.25 * height - 5 * 25 + 5);
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const addEntry = async () => {
    if (!formData.weight) return;

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        date: formData.date,
        weight: parseFloat(formData.weight),
        body_fat: formData.body_fat ? parseFloat(formData.body_fat) : null,
        notes: formData.notes || null,
      }),
    });

    if (res.ok) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        body_fat: '',
        notes: '',
      });
      fetchProgress();
    }
  };

  const deleteEntry = async (id) => {
    await fetch('/api/progress', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ id }),
    });
    fetchProgress();
  };

  const getWeightTrend = () => {
    if (entries.length < 2) return null;
    const latest = entries[0].weight;
    const previous = entries[1].weight;
    const diff = latest - previous;
    return { diff: Math.abs(diff).toFixed(1), isDown: diff < 0 };
  };

  const trend = getWeightTrend();

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
          PROGRESS TRACKER
        </motion.h1>
      </div>

      <motion.div
        className="progress-form-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2>Log Progress</h2>
        <div className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="75.5"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="15.0"
                value={formData.body_fat}
                onChange={(e) => setFormData({ ...formData, body_fat: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="How are you feeling?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>
          <button className="btn-primary" onClick={addEntry}>
            <Plus size={20} />
            Add Entry
          </button>
        </div>
      </motion.div>


      {trend && (
        <motion.div
          className="trend-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="trend-content">
            {trend.isDown ? (
              <TrendingDown size={32} className="trend-icon down" />
            ) : (
              <TrendingUp size={32} className="trend-icon up" />
            )}
            <div>
              <div className="trend-label">Weight Change</div>
              <div className="trend-value">
                {trend.isDown ? '-' : '+'}{trend.diff} kg
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="calculator-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <div className="card-header">
          <h2>Body Metrics</h2>
          <div className="height-input">
            <label>Height (cm)</label>
            <input 
              type="number" 
              placeholder="175" 
              defaultValue={175}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              style={{ width: '80px', marginLeft: '10px' }}
            />
          </div>
        </div>
        
        <div className="calc-grid">
          <div className="calc-item">
            <div className="calc-label">BMI</div>
            <div className="calc-value">{calculateBMI()}</div>
            <div className="calc-status" style={{ color: getBMIColor() }}>{getBMIStatus()}</div>
          </div>
          <div className="calc-item">
            <div className="calc-label">Est. BMR</div>
            <div className="calc-value">{calculateBMR()}</div>
            <div className="calc-status">kcal / day</div>
          </div>
        </div>
      </motion.div>

      <div className="progress-list">
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.id}
            className="progress-entry"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
          >
            <div className="entry-date">
              {new Date(entry.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="entry-stats">
              <div className="stat">
                <span className="stat-label">Weight</span>
                <span className="stat-value">{entry.weight} kg</span>
              </div>
              {entry.body_fat && (
                <div className="stat">
                  <span className="stat-label">Body Fat</span>
                  <span className="stat-value">{entry.body_fat}%</span>
                </div>
              )}
            </div>
            {entry.notes && <div className="entry-notes">{entry.notes}</div>}
            <button
              className="btn-icon-danger"
              onClick={() => deleteEntry(entry.id)}
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="empty-state">
          <p>No progress entries yet. Start tracking your journey!</p>
        </div>
      )}
    </motion.div>
  );
}
