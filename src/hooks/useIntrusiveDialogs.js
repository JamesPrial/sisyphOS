import { useState, useEffect, useRef } from 'react';
import {
  getRandomEmptyError,
  getRandomChoiceDialog,
  getRandomConfirmationLoop,
  getRandomContradictoryDialog,
  getRandomWaitingDialog,
} from '../data/philosophy.js';

/**
 * useIntrusiveDialogs - Manages random intrusive dialog interruptions
 *
 * Dialogs appear at random intervals (20-45 seconds) with weighted selection:
 * - Empty errors: 20%
 * - Choice dialogs: 25%
 * - Confirmation loops: 20%
 * - Contradictory dialogs: 20%
 * - Waiting dialogs: 15%
 *
 * Only one dialog is shown at a time. Dismissing schedules the next.
 */
export function useIntrusiveDialogs() {
  const [currentDialog, setCurrentDialog] = useState(null);
  const timeoutRef = useRef(null);

  /**
   * Returns a random delay between 20-45 seconds in milliseconds
   */
  const getRandomDelay = () => {
    const minDelay = 20000; // 20 seconds
    const maxDelay = 45000; // 45 seconds
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  };

  /**
   * Selects a random dialog type based on weighted probabilities
   * Returns: 'empty' | 'choice' | 'confirmation' | 'contradictory' | 'waiting'
   */
  const selectRandomDialogType = () => {
    const weights = [
      { type: 'empty', weight: 20 },
      { type: 'choice', weight: 25 },
      { type: 'confirmation', weight: 20 },
      { type: 'contradictory', weight: 20 },
      { type: 'waiting', weight: 15 },
    ];

    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (const item of weights) {
      cumulativeWeight += item.weight;
      if (random < cumulativeWeight) {
        return item.type;
      }
    }

    return 'empty'; // Fallback
  };

  /**
   * Creates a dialog object based on the selected type
   */
  const createDialog = (type) => {
    switch (type) {
      case 'empty':
        return {
          type: 'empty',
          content: { title: getRandomEmptyError() },
          metadata: {},
        };

      case 'choice':
        return {
          type: 'choice',
          content: getRandomChoiceDialog(),
          metadata: {},
        };

      case 'confirmation':
        const confirmationLoop = getRandomConfirmationLoop();
        return {
          type: 'confirmation',
          content: confirmationLoop,
          metadata: { currentStage: 0, totalStages: confirmationLoop.stages.length },
        };

      case 'contradictory':
        return {
          type: 'contradictory',
          content: getRandomContradictoryDialog(),
          metadata: {},
        };

      case 'waiting':
        return {
          type: 'waiting',
          content: getRandomWaitingDialog(),
          metadata: {},
        };

      default:
        return null;
    }
  };

  /**
   * Shows a random dialog and schedules the next one
   */
  const showRandomDialog = () => {
    // Don't show a new dialog if one is already open
    if (currentDialog !== null) {
      console.log('[IntrusiveDialogs] Dialog already open, skipping');
      return;
    }

    const dialogType = selectRandomDialogType();
    console.log('[IntrusiveDialogs] Showing dialog type:', dialogType);
    const dialog = createDialog(dialogType);
    setCurrentDialog(dialog);
  };

  /**
   * Schedules the next dialog to appear after a random delay
   */
  const scheduleNextDialog = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const delay = getRandomDelay();
    console.log(`[IntrusiveDialogs] Next dialog scheduled in ${delay}ms (${(delay/1000).toFixed(1)}s)`);
    timeoutRef.current = setTimeout(() => {
      showRandomDialog();
    }, delay);
  };

  /**
   * Dismisses the current dialog and schedules the next one
   * For confirmation loops, advances to next stage instead of dismissing
   */
  const dismissDialog = () => {
    console.log('[IntrusiveDialogs] dismissDialog called, current type:', currentDialog?.type);

    // Handle confirmation loops - advance to next stage
    if (currentDialog?.type === 'confirmation') {
      const { currentStage, totalStages } = currentDialog.metadata;
      const nextStage = currentStage + 1;

      if (nextStage < totalStages) {
        // Advance to next stage
        console.log(`[IntrusiveDialogs] Advancing confirmation loop to stage ${nextStage}/${totalStages}`);
        setCurrentDialog({
          ...currentDialog,
          metadata: { currentStage: nextStage, totalStages },
        });
        return; // Don't schedule next dialog yet
      }
    }

    // Dismiss current dialog
    console.log('[IntrusiveDialogs] Dismissing dialog and scheduling next');
    setCurrentDialog(null);

    // Schedule the next intrusive dialog
    scheduleNextDialog();
  };

  /**
   * Initialize the intrusive dialog system on mount
   */
  useEffect(() => {
    // Schedule the first dialog
    scheduleNextDialog();

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  return {
    currentDialog,
    dismissDialog,
  };
}
