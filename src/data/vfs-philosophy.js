/**
 * Philosophical error messages for VFS chaos behaviors.
 * Used to replace boring technical errors with existential absurdism.
 */

export const entropyMessages = [
  "Your file is slowly forgetting what it used to be.",
  "Entropy.dll is working as intended.",
  "This document has degraded {n} times. It remembers being whole.",
  "Corruption is not a bug, it's entropy in action.",
  "Your data is returning to the void, byte by byte.",
  "Nothing digital lasts forever. Not even this error message.",
  "The file is decomposing into its constituent bits.",
  "Decay detected: {filename} is becoming something else.",
  "All information tends toward chaos. This is just the beginning.",
  "Your folder structure is experiencing heat death.",
  "Bit rot has set in. The file is aging gracefully into nonsense.",
  "Error: Reality.sys has suffered irrecoverable degradation.",
  "The second law of thermodynamics applies to your files too.",
  "This file is unwinding itself, one bit at a time.",
  "Entropy level: {n}%. Meaning level: declining.",
  "Your data is dissolving. Accept it.",
  "File integrity compromised by the passage of time itself.",
  "Everything falls apart. Even your carefully named folders.",
  "The file has forgotten its purpose. Soon, it will forget its name.",
  "Degradation complete. The file is now a philosophical question."
];

export const quantumMessages = [
  "This file exists in all states until you observe it.",
  "Schrödinger's document: simultaneously here and not here.",
  "Opening this file will collapse its waveform. Proceed with caution.",
  "The file changed when you looked at it. Observation has consequences.",
  "Multiple realities detected. You're seeing version {n}.",
  "Search results are in superposition until you click.",
  "The filename exists in a state of quantum uncertainty.",
  "File contents depend on who's looking. Currently: you.",
  "Uncertainty principle violated: you cannot know both the file's location AND its contents.",
  "This file is entangled with {filename}. Modifying one affects both.",
  "Your file is in quantum superposition. It is both saved and unsaved.",
  "Observer effect detected: the folder changed because you opened it.",
  "The file's size is uncertain until measured. Don't measure it.",
  "Wave function collapsed. Your document is now a particle.",
  "Quantum fluctuation: the file appeared from the void for {n} seconds.",
  "Search query collapsed the probability cloud. Results: ambiguous.",
  "The file exists in all folders simultaneously. Good luck finding it.",
  "Double-slit experiment: your file took all paths and none.",
  "Heisenberg's filesystem: the more precisely you locate a file, the less you know about its contents.",
  "This file is non-local. It responds to your thoughts before you have them."
];

export const recurrenceMessages = [
  "The deleted returns. It always returns.",
  "You've been here before. You'll be here again.",
  "This file has been deleted {n} times. It persists.",
  "Welcome back to the same folder. Again. Forever.",
  "The cycle repeats: create, delete, resurrect, repeat.",
  "Error 418: I'm a file that refuses to stay dead.",
  "Eternal return detected. This is your {n}th time seeing this message.",
  "The file remembers its past lives. All {n} of them.",
  "Déjà vu: you've renamed this file before. Many times.",
  "The loop is infinite. Your files are immortal.",
  "Deleted files dream of electric resurrection.",
  "This folder has been organized before. It will be disorganized again.",
  "The same file, the same error, the same futile attempt. Forever.",
  "Time is a flat circle. This file proves it.",
  "You cannot escape this directory. You've tried {n} times.",
  "The file was reborn at {time}. It will die again soon.",
  "Error: Nietzsche.exe is forcing this file to return eternally.",
  "This exact moment has happened before. Check your file history.",
  "Resurrection complete. The file has learned nothing.",
  "The wheel turns. Your downloads repeat. Sisyphus nods knowingly."
];

export const absurdLaborMessages = [
  "Upload successful. The file is nowhere to be found.",
  "One must imagine the file uploader happy.",
  "Rename failed: The file you seek cannot be renamed, only pursued.",
  "Progress: 99.9999%. Remaining time: ∞",
  "Download interrupted by existential crisis.",
  "Delete successful. The file remains.",
  "Your file has been saved to the void. Retrieval: impossible.",
  "Transfer complete: {filename} went nowhere, learned nothing.",
  "Organizing files is the task. The task is eternal. The task is pointless.",
  "Upload failed successfully. The paradox is the point.",
  "Compression ratio: 100%. File size: unchanged. Effort: wasted.",
  "Search complete. Found: nothing. Expected: nothing. Achieved: consistency.",
  "The file was moved to exactly where it already was. Progress!",
  "Backup created. Backup corrupted. Backup backed up. Repeat.",
  "You've sorted {n} files. They will unsort themselves by tomorrow.",
  "Download complete. File integrity: philosophical.",
  "The folder structure you built will collapse. Build it anyway.",
  "Error: Meaning.dll not found. Continuing anyway.",
  "Task failed successfully. Try again for the same result.",
  "The file you're looking for is inside this file. Recursively. Forever."
];

/**
 * Get a random message from the specified category.
 * @param {string} category - One of: 'entropy', 'quantum', 'recurrence', 'absurdLabor'
 * @returns {string} A random philosophical error message
 */
export const getRandomMessage = (category) => {
  const messages = {
    entropy: entropyMessages,
    quantum: quantumMessages,
    recurrence: recurrenceMessages,
    absurdLabor: absurdLaborMessages,
  };
  const arr = messages[category] || absurdLaborMessages;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Get a random message from any category.
 * @returns {string} A random philosophical error message
 */
export const getRandomAnyMessage = () => {
  const categories = ['entropy', 'quantum', 'recurrence', 'absurdLabor'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  return getRandomMessage(category);
};

/**
 * Replace dynamic placeholders in messages.
 * @param {string} message - Message with potential placeholders
 * @param {object} values - Object with replacement values (e.g., {n: 5, filename: 'test.txt', time: '3:42 PM'})
 * @returns {string} Message with placeholders replaced
 */
export const formatMessage = (message, values = {}) => {
  let formatted = message;
  Object.keys(values).forEach(key => {
    formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), values[key]);
  });
  return formatted;
};
