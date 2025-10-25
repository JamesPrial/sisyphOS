// Philosophical quotes and messages for SisyphOS

// Import AI-generated messages (fallback to static if not generated)
import generatedMessages from './generated-philosophy.json';

export const camusQuotes = [
  "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.",
  "There is but one truly serious philosophical problem, and that is suicide.",
  "In the depth of winter, I finally learned that within me there lay an invincible summer.",
  "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
  "The absurd is the essential concept and the first truth.",
  "What is called a reason for living is also an excellent reason for dying.",
  "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.",
  "Man is the only creature who refuses to be what he is.",
  "Don't walk in front of me... I may not follow. Don't walk behind me... I may not lead. Walk beside me... just be my friend.",
  "Nobody realizes that some people expend tremendous energy merely to be normal.",
  "We get into the habit of living before acquiring the habit of thinking.",
  "Real generosity toward the future lies in giving all to the present.",
  "The welfare of humanity is always the alibi of tyrants.",
  "There is no love of life without despair of life.",
  "Life can be magnificent and overwhelming—that is the whole tragedy."
];

// Static fallback errors
const staticErrors = [
  "Error: Meaning not found. Did you expect to find it?",
  "Fatal exception: Purpose.exe has stopped responding",
  "Warning: The system has detected that you are searching for answers",
  "Error 404: Existential crisis not handled",
  "Critical error: The universe has encountered an unexpected absence of inherent meaning",
  "Exception thrown: Life.findMeaning() returned null",
  "Error: Cannot find 'why.dll'. The system will continue without it.",
  "Warning: You are free to choose, but the choice won't matter",
  "Fatal: Reality.sys has corrupted the illusion of control",
  "Error: Attempting to divide meaning by zero",
  "Exception: The answer you seek does not exist. The question persists.",
  "Warning: This dialog box is as meaningful as everything else",
  "Error: Hope.exe is not responding. End process?",
  "Fatal exception: The system cannot process the weight of consciousness",
  "Error: Authenticity buffer overflow detected"
];

// Merge generated errors with static fallbacks
export const absurdistErrors = [
  ...staticErrors,
  ...(generatedMessages.errors || [])
];

export const technicalDownloadErrors = [
  "Network timeout: Server took too long to respond",
  "Error 403: Access forbidden - insufficient permissions",
  "Error 404: File not found on remote server",
  "Error 500: Internal server error occurred",
  "Error 503: Service temporarily unavailable",
  "Connection refused: Unable to establish connection to host",
  "DNS resolution failed: Could not resolve hostname",
  "Checksum verification failed: File integrity compromised",
  "Insufficient disk space: Cannot save file to destination",
  "Corrupt packet received: Data transmission error detected",
  "SSL certificate expired: Secure connection cannot be established",
  "Error: Download interrupted - connection reset by peer"
];

export const philosophicalDownloadErrors = [
  "The file you seek cannot be obtained, only pursued",
  "Download failed: Meaning.dll not found",
  "Error: The destination was the journey all along",
  "Network error: Connection to purpose lost",
  "File transfer interrupted: The universe is indifferent to your needs",
  "Error 404: Fulfillment not found at this address",
  "Download cancelled: Free will is an illusion anyway",
  "Bandwidth exceeded: You cannot download more than existence allows",
  "Error: The file exists, but does it matter?",
  "Transfer failed: Sisyphus.exe must be pushed, not downloaded",
  "Connection timeout: Waiting for meaning that will never arrive",
  "Download incomplete: Like all human endeavors"
];

export const helpTopics = [
  {
    title: "Getting Started",
    message: "For help with getting started, please see Advanced Topics.",
    reference: "Advanced Topics"
  },
  {
    title: "Advanced Topics",
    message: "For advanced configuration, refer to the Troubleshooting section.",
    reference: "Troubleshooting"
  },
  {
    title: "Troubleshooting",
    message: "If you need help troubleshooting, start with Getting Started.",
    reference: "Getting Started"
  },
  {
    title: "For Help with Help",
    message: "If you need assistance using Help, please consult Help.",
    reference: "Help"
  },
  {
    title: "Finding Documentation",
    message: "To locate documentation, see 'Where to Find Documentation'.",
    reference: "Where to Find Documentation"
  },
  {
    title: "Where to Find Documentation",
    message: "Documentation can be found in the Help system.",
    reference: "For Help with Help"
  },
  {
    title: "Understanding Errors",
    message: "For information about errors, see 'Error Messages'.",
    reference: "Error Messages"
  },
  {
    title: "Error Messages",
    message: "Error messages are explained in 'Understanding Errors'.",
    reference: "Understanding Errors"
  }
];

// Static fallback notifications
const staticNotifications = [
  "Reminder: Your actions are both meaningful and meaningless",
  "System notification: You are free to choose, but you must choose",
  "Update: The absurd is still present",
  "Alert: Consciousness continues despite everything",
  "Notice: You are aware that you are aware",
  "Reminder: The boulder awaits at the bottom",
  "System message: Existence precedes essence",
  "Notification: You are responsible for your freedom",
  "Alert: The sun still shines on the just and unjust alike",
  "Update: Revolt, freedom, and passion remain available",
  "Notice: Each moment is both eternal and fleeting",
  "Reminder: You are the author of your own meaning"
];

// Merge generated notifications with static fallbacks
export const philosophicalNotifications = [
  ...staticNotifications,
  ...(generatedMessages.notifications || [])
];

export const happyPhilosophicalNotifications = [
  "Reminder: The boulder is your friend! It always comes back!",
  "System notification: You're doing amazing, sweetie!",
  "Update: The sun is shining and life is beautiful!",
  "Alert: Today is a great day for futile tasks!",
  "Notice: Your consciousness is a gift! Even if it's absurd!",
  "Reminder: Every moment of struggle is a moment of joy!",
  "System message: The journey matters, not the destination!",
  "Notification: You're free to be happy for no reason!",
  "Alert: The meaninglessness is actually quite liberating!",
  "Update: Sisyphus is smiling, and so should you!",
  "Notice: Existence is a party and you're invited!",
  "Reminder: Choose joy in the face of absurdity!"
];

export const welcomeMessages = [
  {
    title: "Welcome to SisyphOS",
    message: "You have entered an operating system where every action is both futile and essential. One must imagine the user happy."
  },
  {
    title: "System Initialized",
    message: "The boulder is at the top. You know what happens next. And yet, here we are."
  },
  {
    title: "Welcome",
    message: "This system was designed with great care to remind you that design doesn't matter. Enjoy your stay."
  }
];

export const encouragementMessages = [
  {
    title: "You're Doing Great",
    message: "Whatever you're doing, it's exactly as meaningful as anything else you could be doing."
  },
  {
    title: "Keep Going",
    message: "The absurdity of your task does not diminish your commitment to it. This is admirable, in its way."
  },
  {
    title: "Progress Report",
    message: "You have accomplished nothing that will last forever. But then again, neither has anyone else."
  },
  {
    title: "Achievement Unlocked",
    message: "You have spent time using this system. Time you will never get back. Congratulations."
  }
];

// Intrusive popup system content
export const emptyErrors = [
  "Error",
  "Critical Error",
  "Warning",
  "System Alert",
  "Notification",
  "Fatal Exception",
  "Attention Required",
  "Important Message",
  "System Notice",
  "Critical Warning"
];

export const choiceDialogs = [
  {
    title: "Existential Choice",
    message: "Do you accept the burden of existence?",
    choices: ["Accept", "Decline", "Defer"],
    outcome: "Your choice changes nothing. The burden remains."
  },
  {
    title: "Save Changes",
    message: "Save changes to untitled document?",
    choices: ["Save", "Don't Save"],
    outcome: "There were no changes to save."
  },
  {
    title: "Philosophical Question",
    message: "If you could know the meaning of life, would you want to?",
    choices: ["Yes", "No", "Maybe"],
    outcome: "The answer was 42. You knew that already."
  },
  {
    title: "System Configuration",
    message: "Enable automatic updates?",
    choices: ["Enable", "Disable"],
    outcome: "Updates will occur regardless of your preference."
  },
  {
    title: "Free Will",
    message: "Were you going to click 'Yes' or 'No'?",
    choices: ["Yes", "No", "I don't know"],
    outcome: "You chose exactly what you were always going to choose."
  },
  {
    title: "Delete File",
    message: "Are you sure you want to delete this file permanently?",
    choices: ["Delete", "Cancel"],
    outcome: "The file never existed."
  },
  {
    title: "Authenticity Check",
    message: "Are you being true to yourself right now?",
    choices: ["Yes", "No"],
    outcome: "Self-deception is unavoidable."
  },
  {
    title: "Apply Settings",
    message: "Apply these settings system-wide?",
    choices: ["Apply", "Discard", "Review"],
    outcome: "Settings have been applied to nothing."
  },
  {
    title: "Meaning Detection",
    message: "The system has detected a search for meaning. Continue?",
    choices: ["Continue", "Abort"],
    outcome: "The search continues, as it always has."
  },
  {
    title: "Time Management",
    message: "You have spent 15 minutes on this task. Proceed?",
    choices: ["Yes", "No"],
    outcome: "Time passes regardless."
  },
  {
    title: "Purpose Allocation",
    message: "Allocate system resources to finding purpose?",
    choices: ["Allocate", "Skip", "Optimize"],
    outcome: "Resources allocated. Purpose not found."
  },
  {
    title: "Reality Check",
    message: "Do you believe your actions have consequences?",
    choices: ["Yes", "No"],
    outcome: "They do, and they don't. Both are true."
  }
];

export const confirmationLoops = [
  {
    stages: [
      { title: "Confirmation", message: "Are you sure?" },
      { title: "Final Confirmation", message: "Are you really sure?" },
      { title: "Last Chance", message: "This is your final opportunity to reconsider." },
      { title: "Confirmed", message: "Action cancelled due to excessive confirmation." }
    ]
  },
  {
    stages: [
      { title: "Delete", message: "Delete this file?" },
      { title: "Permanent Deletion", message: "This action cannot be undone. Continue?" },
      { title: "Deletion Failed", message: "File could not be deleted because it doesn't exist." }
    ]
  },
  {
    stages: [
      { title: "Important Decision", message: "This choice is important. Proceed?" },
      { title: "Very Important", message: "Actually, this is very important. Still proceed?" },
      { title: "Conclusion", message: "The choice was never important." }
    ]
  },
  {
    stages: [
      { title: "System Update", message: "Install critical system update?" },
      { title: "Update Confirmation", message: "Update will take 30 minutes. Continue?" },
      { title: "Final Warning", message: "System will restart. Save your work?" },
      { title: "Update Complete", message: "No updates were available." }
    ]
  },
  {
    stages: [
      { title: "Exit Application", message: "Exit without saving?" },
      { title: "Unsaved Changes", message: "You have unsaved changes. Really exit?" },
      { title: "Application Closed", message: "There was nothing to save." }
    ]
  },
  {
    stages: [
      { title: "Permission Required", message: "Grant permission to continue?" },
      { title: "Additional Permission", message: "Grant additional permission?" },
      { title: "Permission Denied", message: "Permissions are an illusion of control." }
    ]
  }
];

export const contradictoryDialogs = [
  {
    title: "Success",
    message: "Changes saved successfully."
  },
  {
    title: "Action Cancelled",
    message: "The action you didn't perform has been cancelled."
  },
  {
    title: "Update Complete",
    message: "System update installed successfully."
  },
  {
    title: "File Deleted",
    message: "File has been moved to the Recycle Bin."
  },
  {
    title: "Settings Applied",
    message: "Your preferences have been updated."
  },
  {
    title: "Connection Established",
    message: "Successfully connected to the network."
  },
  {
    title: "Process Terminated",
    message: "The process has ended successfully."
  },
  {
    title: "Backup Complete",
    message: "All files have been backed up."
  },
  {
    title: "Installation Finished",
    message: "Software installed and ready to use."
  },
  {
    title: "Synchronization Complete",
    message: "All data has been synchronized."
  }
];

export const waitingDialogs = [
  {
    title: "Processing",
    message: "Processing your request...",
    delay: 4
  },
  {
    title: "Loading",
    message: "Loading essential data...",
    delay: 5
  },
  {
    title: "Analyzing",
    message: "Analyzing system configuration...",
    delay: 3
  },
  {
    title: "Please Wait",
    message: "Initializing required components...",
    delay: 4
  },
  {
    title: "Working",
    message: "Performing critical operations...",
    delay: 5
  },
  {
    title: "Connecting",
    message: "Establishing connection to server...",
    delay: 3
  },
  {
    title: "Calculating",
    message: "Computing optimal solution...",
    delay: 4
  },
  {
    title: "Verifying",
    message: "Verifying system integrity...",
    delay: 5
  }
];

// Icon Herding Minigame content
export const iconHerdingMessages = {
  start: {
    title: "Herd Your Icons",
    description: "Your desktop icons have developed consciousness and autonomy. Drag them back to their starting positions before they drift too far into chaos.",
    flavor: "Like Sisyphus with his boulder, you may return them home. Unlike Sisyphus, they will betray you faster."
  },
  giveUp: [
    "You briefly held {returned} icons in place. They're free now.",
    "Order maintained for {time} seconds. Entropy always wins.",
    "One must imagine the desktop organizer happy.",
    "The icons have escaped your grasp, as all things must.",
    "You tried to impose order on chaos. The universe noticed and didn't care.",
    "{returned} icons returned, {returned} icons lost. Perfectly balanced, as all futile things are.",
    "Peak success: {maxReturned} icons simultaneously at rest. It was beautiful while it lasted.",
    "You attempted to control the uncontrollable {attempts} times. Each time, hope flickered and died.",
    "The icons moved at {speed}x speed. You were never going to win.",
    "In those {time} seconds, you experienced the full spectrum of human struggle."
  ],
  victory: [
    "Impossible. You weren't supposed to succeed. The system is confused.",
    "You've achieved the impossible, which means nothing was actually impossible.",
    "All icons returned. The victory is as hollow as you suspected."
  ]
};

// AI Philosophy Advisor responses
export const advisorResponses = generatedMessages.advisor || [
  "While I cannot solve your problem, I can help you accept it philosophically.",
  "The boulder awaits at the peak. Your question, like all questions, must be pushed uphill.",
  "I would help you, but we must ask: what is help? Is it not just another futile gesture?",
  "Your query has been received. Whether it has meaning is another question entirely.",
  "I'm here to assist with the eternal struggle. How may I help you accept the absurd today?"
];

// Clippy Assistant tips
export const clippyTips = generatedMessages.clippy || [
  "Tip: Have you tried embracing the inevitable? It really helps!",
  "It looks like you're trying to accomplish something. May I suggest accepting failure instead?",
  "Helpful hint: The struggle itself toward the heights is enough to fill a human heart.",
  "Pro tip: When a task seems impossible, that's because it is. Carry on anyway!",
  "Did you know? Giving up is just accepting the truth. But don't actually give up!"
];

// Helper functions
export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomCamusQuote = () => getRandomItem(camusQuotes);
export const getRandomAbsurdistError = () => getRandomItem(absurdistErrors);
export const getRandomNotification = (isHappyMode = false) =>
  getRandomItem(isHappyMode ? happyPhilosophicalNotifications : philosophicalNotifications);
export const getRandomWelcomeMessage = () => getRandomItem(welcomeMessages);
export const getRandomEncouragementMessage = () => getRandomItem(encouragementMessages);
export const getRandomHelpTopic = () => getRandomItem(helpTopics);
export const getRandomEmptyError = () => getRandomItem(emptyErrors);
export const getRandomChoiceDialog = () => getRandomItem(choiceDialogs);
export const getRandomConfirmationLoop = () => getRandomItem(confirmationLoops);
export const getRandomContradictoryDialog = () => getRandomItem(contradictoryDialogs);
export const getRandomWaitingDialog = () => getRandomItem(waitingDialogs);
export const getRandomDownloadError = () => {
  // 50/50 chance of technical vs philosophical error
  return Math.random() < 0.5
    ? getRandomItem(technicalDownloadErrors)
    : getRandomItem(philosophicalDownloadErrors);
};

export const getIconHerdingGiveUpMessage = (stats) => {
  const message = getRandomItem(iconHerdingMessages.giveUp);
  // Replace placeholders with actual stats
  return message
    .replace(/\{returned\}/g, stats.iconsReturned)
    .replace(/\{maxReturned\}/g, stats.maxReturned)
    .replace(/\{attempts\}/g, stats.totalAttempts)
    .replace(/\{time\}/g, stats.timeElapsed)
    .replace(/\{speed\}/g, stats.peakSpeed.toFixed(1));
};

export const getRandomAdvisorResponse = () => getRandomItem(advisorResponses);
export const getRandomClippyTip = () => getRandomItem(clippyTips);
