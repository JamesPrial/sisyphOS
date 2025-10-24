import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useOSStore from './store/osStore';
import Desktop from './components/Desktop';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import Dialog from './components/Dialog';
import ChoiceDialog from './components/ChoiceDialog';
import WelcomeScreen from './components/WelcomeScreen';
import { NotificationManager } from './components/PhilosophyNotification';
import usePhilosophyNotifications from './hooks/usePhilosophyNotifications';
import { useIntrusiveDialogs } from './hooks/useIntrusiveDialogs';
import { getRandomWelcomeMessage, getRandomEncouragementMessage } from './data/philosophy';
import './styles/minimalist.css';

function App() {
  const { openWindows, addWindow, isHappyMode } = useOSStore();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(null);
  const [encouragementDialog, setEncouragementDialog] = useState(null);

  // Philosophy notifications (enabled with 30-60 second intervals)
  const { notifications, dismissNotification } = usePhilosophyNotifications(true, 30000, 60000, isHappyMode);

  // Intrusive dialogs (20-45 second intervals)
  const { currentDialog, dismissDialog } = useIntrusiveDialogs();

  // Show welcome screen on first load
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('sisyphOS-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeScreen(true);
    }
  }, []);

  // Apply happy mode CSS class to body
  useEffect(() => {
    if (isHappyMode) {
      document.body.classList.add('happy-mode');
    } else {
      document.body.classList.remove('happy-mode');
    }
  }, [isHappyMode]);

  const handleEnterSisyphOS = () => {
    setShowWelcomeScreen(false);
    sessionStorage.setItem('sisyphOS-welcome-seen', 'true');

    // Show a welcome dialog after entering
    setTimeout(() => {
      const welcome = getRandomWelcomeMessage();
      setWelcomeMessage(welcome);
      setShowWelcomeDialog(true);
    }, 500);
  };

  // Show random encouragement dialog after 5 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      const encouragement = getRandomEncouragementMessage();
      setEncouragementDialog(encouragement);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timer);
  }, []);

  // Test function to open a demo window
  const openDemoWindow = () => {
    addWindow({
      id: `demo-${Date.now()}`,
      title: 'About SisyphOS',
      content: 'Welcome to SisyphOS - An absurdist fantasy operating system',
      appType: 'text',
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Welcome Screen */}
      <AnimatePresence>
        {showWelcomeScreen && <WelcomeScreen onEnter={handleEnterSisyphOS} />}
      </AnimatePresence>

      {/* Desktop with icons */}
      <Desktop />

      {/* Windows layer - absolutely positioned overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none', // Allow clicks to pass through to desktop
        }}
      >
        <AnimatePresence>
          {openWindows.map((window) => (
            <div key={window.id} style={{ pointerEvents: 'auto' }}>
              <Window window={window} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Taskbar at bottom */}
      <Taskbar />

      {/* Philosophy notifications */}
      <NotificationManager
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Welcome dialog */}
      {welcomeMessage && (
        <Dialog
          title={welcomeMessage.title}
          message={welcomeMessage.message}
          onOK={() => setShowWelcomeDialog(false)}
          isOpen={showWelcomeDialog}
        />
      )}

      {/* Encouragement dialog */}
      {encouragementDialog && (
        <Dialog
          title={encouragementDialog.title}
          message={encouragementDialog.message}
          onOK={() => setEncouragementDialog(null)}
          isOpen={!!encouragementDialog}
        />
      )}

      {/* Intrusive dialogs - random interruptions */}
      {currentDialog && (() => {
        switch (currentDialog.type) {
          case 'empty':
            // Empty error - title only, no message content
            return (
              <Dialog
                title={currentDialog.content.title}
                allowEmpty={true}
                onOK={dismissDialog}
                isOpen={true}
              />
            );

          case 'choice':
            // Multiple-choice dialog where all choices lead to same outcome
            return (
              <ChoiceDialog
                choiceData={currentDialog.content}
                onDismiss={dismissDialog}
                isOpen={true}
              />
            );

          case 'confirmation':
            // Multi-stage confirmation loop
            return (
              <Dialog
                title={currentDialog.content.stages[currentDialog.metadata.currentStage].title}
                message={currentDialog.content.stages[currentDialog.metadata.currentStage].message}
                onOK={dismissDialog}
                isOpen={true}
              />
            );

          case 'contradictory':
            // Dialog showing success for doing nothing
            return (
              <Dialog
                title={currentDialog.content.title}
                message={currentDialog.content.message}
                onOK={dismissDialog}
                isOpen={true}
              />
            );

          case 'waiting':
            // Dialog with forced wait countdown
            return (
              <Dialog
                title={currentDialog.content.title}
                message={currentDialog.content.message}
                initialDelay={currentDialog.content.delay}
                onOK={dismissDialog}
                isOpen={true}
              />
            );

          default:
            return null;
        }
      })()}

      {/* Test button (for development) */}
      <button
        onClick={openDemoWindow}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'var(--color-accent-success)',
          color: 'white',
          borderRadius: 'var(--radius-sm)',
          fontWeight: '600',
          fontSize: '12px',
          boxShadow: 'var(--shadow-md)',
          zIndex: 9999,
        }}
      >
        Test Window
      </button>
    </div>
  );
}

export default App;
