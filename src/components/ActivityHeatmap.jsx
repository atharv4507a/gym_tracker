import { motion } from 'framer-motion';

export default function ActivityHeatmap({ data }) {
  // data: array of { date: 'YYYY-MM-DD', count: number }
  const today = new Date();
  const daysToShow = 98; // 14 weeks
  const heatmapData = [];

  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayData = data.find(item => item.date === dateStr);
    heatmapData.push({
      date: dateStr,
      count: dayData ? dayData.count : 0
    });
  }

  const getIntensityClass = (count) => {
    if (count === 0) return 'h-0';
    if (count === 1) return 'h-1';
    if (count === 2) return 'h-2';
    return 'h-3';
  };

  return (
    <div className="activity-heatmap-container">
      <h3 className="section-title small">Activity Log</h3>
      <div className="heatmap-grid">
        {heatmapData.map((day, i) => (
          <motion.div
            key={day.date}
            className={`heatmap-cell ${getIntensityClass(day.count)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.005 }}
            title={`${day.date}: ${day.count} workouts`}
          />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell h-0" />
        <div className="heatmap-cell h-1" />
        <div className="heatmap-cell h-2" />
        <div className="heatmap-cell h-3" />
        <span>More</span>
      </div>
    </div>
  );
}
