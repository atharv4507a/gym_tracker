import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Clock } from 'lucide-react';

export default function RestTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a subtle sound or vibrate if possible in web
      if ('vibrate' in navigator) navigator.vibrate(200);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = (seconds = 60) => {
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <motion.button
        className="floating-timer-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Clock size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="rest-timer-overlay"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="timer-header">
              <h3>REST TIMER</h3>
              <button className="btn-icon-small" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="timer-display">
              {formatTime(timeLeft)}
            </div>

            <div className="timer-presets">
              <button className="btn-timer" onClick={() => resetTimer(30)}>30s</button>
              <button className="btn-timer" onClick={() => resetTimer(60)}>60s</button>
              <button className="btn-timer" onClick={() => resetTimer(90)}>90s</button>
            </div>

            <div className="timer-controls">
              <button className="btn-timer-main" onClick={toggleTimer}>
                {isActive ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="btn-timer-main" onClick={() => resetTimer(timeLeft)}>
                <RotateCcw size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
