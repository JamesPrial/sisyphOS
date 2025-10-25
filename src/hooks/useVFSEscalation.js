import { useEffect, useState, useCallback } from 'react';
import useOSStore from '../store/osStore';
import { fileSystemAPI } from '../services/fileSystemAPI';

/**
 * useVFSEscalation - Tracks user interactions with VFS and calculates escalation level
 *
 * Escalation level increases based on cumulative user actions (uploads, downloads, etc.)
 * Formula: Math.min(10, Math.floor(totalInteractions / 10))
 * Every 10 interactions = +1 escalation level (caps at level 10)
 *
 * Persists to localStorage and syncs with backend for cross-session tracking.
 */
const useVFSEscalation = () => {
  const [interactions, setInteractions] = useState(0);
  const [level, setLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { setVFSEscalation } = useOSStore();

  // Calculate escalation level from interactions
  const calculateLevel = useCallback((totalInteractions) => {
    return Math.min(10, Math.floor(totalInteractions / 10));
  }, []);

  // Load escalation data from localStorage
  const loadLocalData = useCallback(() => {
    try {
      const storedData = localStorage.getItem('vfs_escalation_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        return {
          interactions: parsed.interactions || 0,
          level: parsed.level || 0,
        };
      }
    } catch (error) {
      console.error('Failed to load escalation data from localStorage:', error);
    }
    return { interactions: 0, level: 0 };
  }, []);

  // Save escalation data to localStorage
  const saveLocalData = useCallback((data) => {
    try {
      localStorage.setItem('vfs_escalation_data', JSON.stringify({
        interactions: data.interactions,
        level: data.level,
        last_updated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to save escalation data to localStorage:', error);
    }
  }, []);

  // Sync with backend
  const syncWithBackend = useCallback(async (localData) => {
    try {
      // Try to get backend data
      const backendData = await fileSystemAPI.getEscalation();

      // Use whichever is higher (backend or local)
      const maxInteractions = Math.max(
        backendData.interactions || 0,
        localData.interactions
      );
      const newLevel = calculateLevel(maxInteractions);

      // Update backend if local has more interactions
      if (localData.interactions > (backendData.interactions || 0)) {
        await fileSystemAPI.updateEscalation(localData.interactions);
      }

      return {
        interactions: maxInteractions,
        level: newLevel,
      };
    } catch (error) {
      console.error('Failed to sync with backend, using local data:', error);
      // Fallback to local data if backend fails
      return localData;
    }
  }, [calculateLevel]);

  // Initialize escalation data on mount
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      // Load local data first
      const localData = loadLocalData();

      // Try to sync with backend
      const syncedData = await syncWithBackend(localData);

      // Update state
      setInteractions(syncedData.interactions);
      setLevel(syncedData.level);
      setVFSEscalation(syncedData.level);

      // Save synced data locally
      saveLocalData(syncedData);

      setIsLoading(false);
    };

    initialize();
  }, [loadLocalData, saveLocalData, syncWithBackend, setVFSEscalation]);

  // Increment interaction count
  const incrementInteraction = useCallback(async () => {
    const newInteractions = interactions + 1;
    const newLevel = calculateLevel(newInteractions);

    // Update local state immediately
    setInteractions(newInteractions);
    setLevel(newLevel);
    setVFSEscalation(newLevel);

    // Save to localStorage
    saveLocalData({ interactions: newInteractions, level: newLevel });

    // Sync with backend (fire and forget)
    try {
      await fileSystemAPI.updateEscalation(newInteractions);
    } catch (error) {
      console.error('Failed to update backend escalation:', error);
      // Continue anyway - local state is updated
    }
  }, [interactions, calculateLevel, setVFSEscalation, saveLocalData]);

  // Reset escalation (for testing or special circumstances)
  const resetEscalation = useCallback(async () => {
    setInteractions(0);
    setLevel(0);
    setVFSEscalation(0);

    // Clear localStorage
    try {
      localStorage.removeItem('vfs_escalation_data');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }

    // Update backend
    try {
      await fileSystemAPI.updateEscalation(0);
    } catch (error) {
      console.error('Failed to reset backend escalation:', error);
    }
  }, [setVFSEscalation]);

  return {
    level,
    interactions,
    incrementInteraction,
    resetEscalation,
    isLoading,
  };
};

export default useVFSEscalation;
