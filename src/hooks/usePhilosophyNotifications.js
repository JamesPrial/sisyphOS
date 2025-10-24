import { useState, useEffect, useCallback } from 'react';
import { getRandomNotification } from '../data/philosophy';

/**
 * Hook for managing random philosophy notifications
 * @param {boolean} enabled - Whether notifications are enabled
 * @param {number} minDelay - Minimum delay between notifications in ms (default: 30000)
 * @param {number} maxDelay - Maximum delay between notifications in ms (default: 60000)
 * @param {boolean} isHappyMode - Whether happy mode is enabled
 */
const usePhilosophyNotifications = (enabled = true, minDelay = 30000, maxDelay = 60000, isHappyMode = false) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationIdCounter, setNotificationIdCounter] = useState(0);

  // Function to add a new notification to the queue
  const addNotification = useCallback((message, duration = 5000) => {
    const newNotification = {
      id: Date.now() + notificationIdCounter,
      message,
      duration,
    };
    setNotificationIdCounter(prev => prev + 1);
    setNotifications(prev => [...prev, newNotification]);
  }, [notificationIdCounter]);

  // Function to remove a notification from the queue
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Effect to schedule random notifications
  useEffect(() => {
    if (!enabled) return;

    const scheduleNextNotification = () => {
      const delay = minDelay + Math.random() * (maxDelay - minDelay);

      return setTimeout(() => {
        const message = getRandomNotification(isHappyMode);
        addNotification(message);
        // Schedule the next notification
        const nextTimer = scheduleNextNotification();
        return nextTimer;
      }, delay);
    };

    const timer = scheduleNextNotification();

    return () => {
      clearTimeout(timer);
    };
  }, [enabled, minDelay, maxDelay, addNotification, isHappyMode]);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
};

export default usePhilosophyNotifications;
