import { useState } from 'react';
import Dialog from './Dialog';

/**
 * ChoiceDialog - Multiple-choice dialog for absurdist interactions
 *
 * Presents 2-3 arbitrary choices where all outcomes lead to the same futile result.
 * Pure absurdism: the illusion of choice without consequence.
 *
 * @param {Object} choiceData - Dialog configuration
 * @param {string} choiceData.title - Dialog title
 * @param {string} choiceData.message - Initial prompt/question
 * @param {string[]} choiceData.choices - Array of 2-3 choice labels
 * @param {string} choiceData.outcome - Futile outcome message (same for all choices)
 * @param {Function} onDismiss - Callback when dialog is fully dismissed
 * @param {boolean} isOpen - Controls dialog visibility
 */
export default function ChoiceDialog({ choiceData, onDismiss, isOpen }) {
  const [showingOutcome, setShowingOutcome] = useState(false);

  const handleChoice = () => {
    // All choices lead to the same outcome - peak absurdism
    setShowingOutcome(true);
  };

  const handleFinalDismiss = () => {
    // Reset state for next use
    setShowingOutcome(false);
    onDismiss();
  };

  // Build buttons array for Dialog component
  // Each choice becomes a button that triggers the same outcome
  const buttons = choiceData.choices.map((choice) => ({
    label: choice,
    onClick: handleChoice,
    disabled: false,
  }));

  return (
    <Dialog
      title={choiceData.title}
      message={showingOutcome ? choiceData.outcome : choiceData.message}
      buttons={showingOutcome ? null : buttons} // null uses default OK button
      onOK={showingOutcome ? handleFinalDismiss : undefined}
      isOpen={isOpen}
    />
  );
}
