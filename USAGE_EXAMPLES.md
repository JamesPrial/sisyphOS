# Philosophy & Dialogs - Usage Examples

## Quick Start Guide

### Using the Dialog Component

```jsx
import Dialog from './components/Dialog';
import { useState } from 'react';

function MyComponent() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button onClick={() => setShowDialog(true)}>
        Show Philosophical Dialog
      </button>

      <Dialog
        title="System Notice"
        message="You have made a choice. The choice is irreversible, yet meaningless."
        onOK={() => setShowDialog(false)}
        isOpen={showDialog}
      />
    </>
  );
}
```

### Using Philosophy Notifications

```jsx
import usePhilosophyNotifications from './hooks/usePhilosophyNotifications';
import { NotificationManager } from './components/PhilosophyNotification';

function MyApp() {
  // Auto notifications every 30-60 seconds
  const { notifications, dismissNotification, addNotification } =
    usePhilosophyNotifications(true, 30000, 60000);

  // Manually trigger a notification
  const showCustomNotification = () => {
    addNotification("The boulder has reached the bottom again.", 5000);
  };

  return (
    <>
      <button onClick={showCustomNotification}>
        Show Notification
      </button>

      <NotificationManager
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </>
  );
}
```

### Using Philosophy Data

```jsx
import {
  getRandomCamusQuote,
  getRandomAbsurdistError,
  getRandomNotification
} from './data/philosophy';

function QuoteDisplay() {
  const quote = getRandomCamusQuote();
  const error = getRandomAbsurdistError();
  const notification = getRandomNotification();

  return (
    <div>
      <p>{quote}</p>
      <p>{error}</p>
      <p>{notification}</p>
    </div>
  );
}
```

### Opening Help or Error Simulator

```jsx
import useOSStore from './store/osStore';

function DesktopShortcut() {
  const { addWindow } = useOSStore();

  const openHelp = () => {
    addWindow({
      id: `help-${Date.now()}`,
      title: 'help.exe',
      content: 'help.exe',
      appType: 'executable',
    });
  };

  const openErrors = () => {
    addWindow({
      id: `errors-${Date.now()}`,
      title: 'errors.exe',
      content: 'errors.exe',
      appType: 'executable',
    });
  };

  return (
    <div>
      <button onClick={openHelp}>Open Help</button>
      <button onClick={openErrors}>Open Error Simulator</button>
    </div>
  );
}
```

### Custom Welcome Dialog Flow

```jsx
import { useState, useEffect } from 'react';
import Dialog from './components/Dialog';
import { getRandomWelcomeMessage } from './data/philosophy';

function WelcomeFlow() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check if user has seen welcome
    const hasSeenWelcome = localStorage.getItem('my-app-welcome');

    if (!hasSeenWelcome) {
      const welcome = getRandomWelcomeMessage();
      setMessage(welcome);
      setShowWelcome(true);
      localStorage.setItem('my-app-welcome', 'true');
    }
  }, []);

  return message ? (
    <Dialog
      title={message.title}
      message={message.message}
      onOK={() => setShowWelcome(false)}
      isOpen={showWelcome}
    />
  ) : null;
}
```

### Timed Encouragement Dialog

```jsx
import { useState, useEffect } from 'react';
import Dialog from './components/Dialog';
import { getRandomEncouragementMessage } from './data/philosophy';

function TimedEncouragement() {
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    // Show encouragement after 5 minutes
    const timer = setTimeout(() => {
      const encouragement = getRandomEncouragementMessage();
      setDialog(encouragement);
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  return dialog ? (
    <Dialog
      title={dialog.title}
      message={dialog.message}
      onOK={() => setDialog(null)}
      isOpen={!!dialog}
    />
  ) : null;
}
```

## Advanced Usage

### Custom Error Dialog in Any Component

```jsx
import { useState } from 'react';
import Dialog from './components/Dialog';
import { getRandomAbsurdistError } from './data/philosophy';

function FileManager() {
  const [errorDialog, setErrorDialog] = useState(null);

  const handleDeleteFile = () => {
    // Trigger philosophical error instead of actual deletion
    setErrorDialog({
      title: "Deletion Failed",
      message: getRandomAbsurdistError()
    });
  };

  return (
    <>
      <button onClick={handleDeleteFile}>Delete File</button>

      {errorDialog && (
        <Dialog
          title={errorDialog.title}
          message={errorDialog.message}
          onOK={() => setErrorDialog(null)}
          isOpen={!!errorDialog}
        />
      )}
    </>
  );
}
```

### Conditional Notification Enabling

```jsx
import usePhilosophyNotifications from './hooks/usePhilosophyNotifications';
import { NotificationManager } from './components/PhilosophyNotification';

function SettingsAwareApp() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Only show notifications if user has enabled them
  const { notifications, dismissNotification } =
    usePhilosophyNotifications(
      notificationsEnabled,  // Enable/disable based on user preference
      45000,                 // 45 second minimum
      90000                  // 90 second maximum
    );

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
        Enable Philosophy Notifications
      </label>

      {notificationsEnabled && (
        <NotificationManager
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      )}
    </>
  );
}
```

### Creating Custom Circular Help Content

```jsx
// In your philosophy.js or custom data file
export const customHelpTopics = [
  {
    title: "Getting Started",
    content: "To begin, please see the Getting Started guide.",
    reference: "Getting Started"
  },
  {
    title: "API Documentation",
    content: "For API details, consult the Implementation Guide.",
    reference: "Implementation Guide"
  },
  {
    title: "Implementation Guide",
    content: "Implementation details can be found in the API Documentation.",
    reference: "API Documentation"
  }
];
```

### Testing Dialog Escape Attempts

```jsx
// The Dialog component prevents all escape attempts:
// ❌ ESC key - preventDefault blocks it
// ❌ Click outside - onClick handler does nothing
// ❌ No X button - not rendered
// ✅ Only OK button - the sole path forward

// Test in browser console:
// document.addEventListener('keydown', (e) => {
//   console.log('Key pressed:', e.key);
//   // ESC will be logged but won't close dialog
// });
```

## Desktop Icon Configuration

### Adding More Philosophy Icons

```javascript
// In osStore.js desktopFiles array:
{
  id: 'file-11',
  name: 'wisdom.exe',
  type: 'executable',
  x: 300,
  y: 250,
  originalX: 300,
  originalY: 250,
  icon: '🧘'  // Custom emoji icon
}
```

### Mapping New Icons to Components

```javascript
// In Window.jsx getAppContent():
case 'wisdom.exe':
  return <WisdomApp />;
```

## Tips & Best Practices

1. **Dialog Timing**: Don't show too many dialogs too quickly. Space them out naturally.

2. **Notification Frequency**: 30-60 seconds is gentle. For more frequent, use 15-30 seconds.

3. **SessionStorage vs LocalStorage**:
   - Use `sessionStorage` for per-session tracking (resets on browser close)
   - Use `localStorage` for persistent tracking (survives browser restart)

4. **Error Messages**: Mix philosophical with practical - make it meaningful AND absurd.

5. **Help Documentation**: Professional styling makes circular references funnier.

6. **Accessibility**: Even limited dialogs should have proper ARIA labels.

7. **Testing**: Always test the "escape attempt" scenarios to ensure inevitability.

## Common Patterns

### On First App Launch
```jsx
useEffect(() => {
  const hasLaunchedApp = localStorage.getItem('app-launched');
  if (!hasLaunchedApp) {
    setShowDialog(true);
    localStorage.setItem('app-launched', 'true');
  }
}, []);
```

### On Repeated Action
```jsx
const [attemptCount, setAttemptCount] = useState(0);

const handleAction = () => {
  setAttemptCount(prev => prev + 1);

  if (attemptCount >= 3) {
    showDialog("You have attempted this 3 times. The result remains unchanged.");
  }
};
```

### On Time Interval
```jsx
useEffect(() => {
  const interval = setInterval(() => {
    const notification = getRandomNotification();
    addNotification(notification);
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, []);
```

## Debugging

### Check if Dialog is Open
```javascript
// In browser console:
document.querySelector('[style*="z-index: 99999"]')
// Should return the dialog overlay if open
```

### Monitor Notifications
```javascript
// Log when notifications appear:
useEffect(() => {
  console.log('Current notifications:', notifications);
}, [notifications]);
```

### Test Welcome Dialog Reset
```javascript
// In browser console:
sessionStorage.removeItem('sisyphOS-welcome-seen');
// Refresh page to see welcome dialog again
```

## Summary

The Philosophy & Dialogs system provides:
- Inescapable acceptance-based dialogs
- Automatic philosophical notifications
- Circular help documentation
- Interactive error simulation
- Rich philosophical content
- Clean, extensible architecture

All components work together to create an absurdist experience where users must accept reality as presented, embrace the meaningless, and find humor in the inevitable.

**"One must imagine Sisyphus happy."** - Albert Camus
