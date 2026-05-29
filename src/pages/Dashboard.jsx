import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Apple, TrendingUp, Flame, Target, Calendar, Award, Zap, Edit3, FileText, Users } from 'lucide-react';

import { useAuth } from '../lib/auth';
import ProgressRing from '../components/ProgressRing';
import ActivityHeatmap from '../components/ActivityHeatmap';

export default function Dashboard() {
  const { user, getToken, updateGoal, isAdmin } = useAuth();
  const [goalUpdating, setGoalUpdating] = useState(false);
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    totalWorkouts: 0,
    mealsConsumed: 0,
    totalMeals: 0,
    avgCalories: 0,
    currentWeight: 0,
    dailyCalories: 0,
    dailyProtein: 0,
    heatmapData: [],
    streak: 0,
    weeklyVolume: [40, 70, 45, 90, 65, 30, 50],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [workoutsRes, mealsRes, progressRes] = await Promise.all([
        fetch('/api/workouts', { headers }),
        fetch('/api/meals', { headers }),
        fetch('/api/progress', { headers }),
      ]);

      const workouts = await workoutsRes.json();
      const meals = await mealsRes.json();
      const progress = await progressRes.json();

      const workoutsCompleted = workouts.filter((w) => w.completed).length;
      const mealsConsumed = meals.filter((m) => m.consumed).length;
      const currentWeight = progress.length > 0 ? progress[0].weight : 0;

      const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayMeals = meals.filter(m => m.day_of_week === todayDay && m.consumed);
      const dailyCalories = todayMeals.reduce((sum, m) => sum + (m.total_calories || 0), 0);
      const dailyProtein = todayMeals.reduce((sum, m) => sum + (m.total_protein || 0), 0);

      const heatmapMap = {};
      workouts.forEach(w => {
        if (w.completed && w.updatedAt) {
          const date = w.updatedAt.split('T')[0];
          heatmapMap[date] = (heatmapMap[date] || 0) + 1;
        }
      });
      const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

      setStats(prev => ({
        ...prev,
        workoutsCompleted,
        totalWorkouts: workouts.length,
        mealsConsumed,
        totalMeals: meals.length,
        currentWeight,
        dailyCalories,
        dailyProtein,
        heatmapData,
        streak: Math.floor(workoutsCompleted / 2) + 1,
      }));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleGoalChange = async (newGoal) => {
    if (newGoal === user?.fitness_goal || goalUpdating) return;
    setGoalUpdating(true);
    try {
      await updateGoal(newGoal);
      await fetchStats(newGoal);
    } catch (err) {
      console.error('Goal update error:', err);
    } finally {
      setGoalUpdating(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <motion.div
      className="page dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Animated Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="page-header">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="greeting-text">{getGreeting()},</p>
          <h1 className="user-name">{user?.name || 'Athlete'}</h1>
        </motion.div>
        
        <motion.div 
          className="hero-streak"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Zap size={18} fill="currentColor" />
          {stats.streak} DAY STREAK
        </motion.div>
      </div>

      {isAdmin ? (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="stats-sidebar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: Dumbbell, label: 'Total Workouts', value: stats.totalWorkouts, color: 'var(--neon-cyan)' },
              { icon: Apple, label: 'Total Meals', value: stats.totalMeals, color: 'var(--neon-pink)' },
              { icon: Target, label: 'Plans Managed', value: '4 Goals', color: 'var(--neon-green)' },
              { icon: Users, label: 'Users', value: 'Admin', color: 'var(--neon-orange)' }
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="stat-tile"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="tile-icon" style={{ color: item.color }}>
                  <item.icon size={24} />
                </div>
                <div>
                  <div className="tile-label">{item.label}</div>
                  <div className="tile-value">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="stats-sidebar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {[
              { icon: Dumbbell, label: 'Manage Workouts', desc: 'Add/edit workout plans for all goals', link: '/workouts', color: 'var(--neon-cyan)' },
              { icon: Apple, label: 'Manage Meals', desc: 'Add/edit diet plans for all goals', link: '/diet', color: 'var(--neon-pink)' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="pro-tip-card"
                style={{ cursor: 'pointer' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                onClick={() => window.location.href = item.link}
              >
                <item.icon size={28} color={item.color} />
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="main-content">
            <motion.div 
              className="dashboard-hero"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="rings-container">
                <ProgressRing 
                  radius={90} 
                  stroke={10} 
                  progress={Math.min((stats.dailyCalories / 2500) * 100, 100)} 
                  color="var(--neon-cyan)" 
                  label={stats.dailyCalories} 
                  sublabel="kcal"
                />
                <ProgressRing 
                  radius={65} 
                  stroke={10} 
                  progress={Math.min((stats.dailyProtein / 150) * 100, 100)} 
                  color="var(--neon-pink)" 
                  label={stats.dailyProtein} 
                  sublabel="protein"
                />
              </div>
              
              <div className="hero-info">
                <div className="hero-badge">DAILY STATUS</div>
                <h2>You've consumed {Math.round((stats.dailyCalories / 2500) * 100)}% of your calorie goal today.</h2>
                <p>Keep going! You need {Math.max(0, 150 - stats.dailyProtein)}g more protein to hit your target.</p>
                
                <div className="mini-chart">
                  {stats.weeklyVolume.map((val, i) => (
                    <div key={i} className="chart-bar-container">
                      <motion.div 
                        className="chart-bar" 
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                      />
                    </div>
                  ))}
                </div>
                <div className="chart-label">Weekly Volume Intensity</div>
              </div>
            </motion.div>

            <ActivityHeatmap data={stats.heatmapData} />
          </div>

          <div className="stats-sidebar">
            {[
              { icon: Dumbbell, label: 'Workouts', value: stats.workoutsCompleted, color: 'var(--neon-cyan)' },
              { icon: Apple, label: 'Meals Logged', value: stats.mealsConsumed, color: 'var(--neon-pink)' },
              { icon: Target, label: 'Current Weight', value: `${stats.currentWeight}kg`, color: 'var(--neon-green)' },
              { icon: Award, label: 'Rank', value: 'Silver III', color: 'var(--neon-orange)' }
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                className="stat-tile"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="tile-icon" style={{ color: item.color }}>
                  <item.icon size={24} />
                </div>
                <div>
                  <div className="tile-label">{item.label}</div>
                  <div className="tile-value">{item.value}</div>
                </div>
              </motion.div>
            ))}

            <motion.div 
              className="pro-tip-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <TrendingUp size={24} color="var(--neon-cyan)" />
              <div>
                <strong>Pro Tip</strong>
                <p>Drinking water before meals can help with weight management.</p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
