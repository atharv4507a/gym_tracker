import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

let toastId = 0;
const listeners = new Set();

export function showToast(message) {
  const id = ++toastId;
  listeners.forEach(fn => fn({ id, message }));
  return id;
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts(prev => [...prev, t]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== t.id));
    }, 2500);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => listeners.delete(addToast);
  }, [addToast]);

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
              color: '#000', borderRadius: '10px', padding: '0.75rem 1.25rem',
              fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 20px rgba(0,212,255,0.3)',
              display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap',
            }}
          >
            <Check size={18} /> {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
