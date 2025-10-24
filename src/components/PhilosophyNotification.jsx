import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PhilosophyNotification = ({ message, duration = 5000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border-light)',
            maxWidth: '350px',
            fontSize: '13px',
            lineHeight: '1.5',
            zIndex: 10000,
            cursor: 'pointer',
            fontStyle: 'italic',
          }}
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onDismiss) onDismiss();
            }, 300);
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
            <div style={{ fontSize: '18px', opacity: 0.7 }}>💭</div>
            <div style={{ flex: 1 }}>{message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification queue manager component
export const NotificationManager = ({ notifications, onDismiss }) => {
  // Only show the first notification in the queue
  const currentNotification = notifications[0];

  return (
    <>
      {currentNotification && (
        <PhilosophyNotification
          key={currentNotification.id}
          message={currentNotification.message}
          duration={currentNotification.duration}
          onDismiss={() => onDismiss(currentNotification.id)}
        />
      )}
    </>
  );
};

export default PhilosophyNotification;
