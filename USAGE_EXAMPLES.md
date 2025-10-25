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

## Progress Bar Usage

### Basic Progress Bar (Integer Percentage)

```jsx
import ProgressBar from './components/ProgressBar';

function BasicExample() {
  const [progress, setProgress] = useState(45);

  return (
    <ProgressBar
      progress={progress}
      // decimalPlaces defaults to 0 for integer display
    />
  );
}
// Displays: 45%
```

### Asymptotic Progress Bar (Floating Point)

```jsx
import ProgressBar from './components/ProgressBar';
import { useState, useEffect } from 'react';

function AsymptoticExample() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        // Zeno's Paradox: approach 100 but never arrive
        const remaining = 100 - current;

        // Variable decay rate based on progress
        let decayRate;
        if (current < 50) decayRate = 0.5;
        else if (current < 80) decayRate = 0.2;
        else if (current < 95) decayRate = 0.05;
        else if (current < 99) decayRate = 0.01;
        else if (current < 99.9) decayRate = 0.001;
        else decayRate = 0.0001;

        const newProgress = current + remaining * decayRate;

        // Never actually reach 100
        return Math.min(newProgress, 99.9999);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <ProgressBar
      progress={progress}
      decimalPlaces={4}  // Show up to 4 decimal places
    />
  );
}
// Displays: 99.9876%
```

### Infinite Loop Progress Bar

```jsx
import ProgressBar from './components/ProgressBar';
import { useState, useEffect } from 'react';

function InfiniteLoopExample() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        const newProgress = current + 1;

        // Reset at 100%
        if (newProgress >= 100) {
          return 0;
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <ProgressBar
      progress={progress}
      decimalPlaces={0}  // Integer display for loop
    />
  );
}
// Displays: 0% → 99% → 100% → 0% → ...
```

### Eternal Recurrence Progress Bar

```jsx
import ProgressBar from './components/ProgressBar';
import { useState, useEffect, useRef } from 'react';

function EternalRecurrenceExample() {
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const resetTimeoutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        const newProgress = current + 1;

        // Auto-reset at 99%
        if (newProgress >= 99) {
          resetTimeoutRef.current = setTimeout(() => {
            setProgress(0);
            setCycles(prev => prev + 1);
          }, 500);
          return 99;
        }

        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <ProgressBar
        progress={progress}
        decimalPlaces={0}
      />
      <p>Cycle {cycles}</p>
    </div>
  );
}
// Displays: 0% → 99% → [pause] → 0% → 99% → ...
// Cycle counter increments each time
```

### Custom Decimal Places

```jsx
// 1 decimal place (99.9%)
<ProgressBar progress={99.87654} decimalPlaces={1} />

// 2 decimal places (99.88%)
<ProgressBar progress={99.87654} decimalPlaces={2} />

// 3 decimal places (99.877%)
<ProgressBar progress={99.87654} decimalPlaces={3} />

// 4 decimal places (99.8765%)
<ProgressBar progress={99.87654} decimalPlaces={4} />
```

### Complete SystemUpdate-style Implementation

```jsx
import ProgressBar from './components/ProgressBar';
import { useState, useEffect } from 'react';

function SystemUpdateExample() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        const remaining = 100 - current;

        // Variable decay rate
        let decayRate;
        if (current < 50) {
          decayRate = 0.5;
          setStatus('Preparing system files...');
        } else if (current < 80) {
          decayRate = 0.2;
          setStatus('Installing updates...');
        } else if (current < 95) {
          decayRate = 0.05;
          setStatus('Almost done...');
        } else if (current < 99) {
          decayRate = 0.01;
          setStatus('Finalizing...');
        } else if (current < 99.9) {
          decayRate = 0.001;
          setStatus('Just a moment...');
        } else {
          decayRate = 0.0001;
          setStatus('Approaching completion...');
        }

        return Math.min(current + remaining * decayRate, 99.9999);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>System Update</h3>
      <ProgressBar progress={progress} decimalPlaces={4} />
      <p>{status}</p>
      <p style={{ fontSize: '0.8em', color: '#666' }}>
        This update will never complete. The closer it gets, the slower it moves.
      </p>
    </div>
  );
}
```

### Random Failure with Escalating Retry (FileDownload Pattern)

```jsx
import ProgressBar from './components/ProgressBar';
import { useState, useEffect, useRef } from 'react';
import { getRandomDownloadError } from './data/philosophy';

function RandomFailureExample() {
  const [progress, setProgress] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [failurePoint, setFailurePoint] = useState(null);
  const intervalRef = useRef(null);

  // Initialize random failure point on mount
  useEffect(() => {
    setFailurePoint(Math.floor(Math.random() * 40) + 60); // 60-99%
  }, []);

  useEffect(() => {
    // Don't create intervals when in failed state
    if (isFailed) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;

        // Check for failure at failure point
        if (!isFailed && newProgress >= failurePoint && prev < failurePoint) {
          const failureChance = Math.min(30 + (retryCount * 15), 90);
          if (Math.random() * 100 < failureChance) {
            setIsFailed(true);
            setErrorMessage(getRandomDownloadError());
            clearInterval(intervalRef.current);
            return failurePoint;
          }
        }

        // Success case - reset at 99%
        if (newProgress >= 99 && !isFailed) {
          setTimeout(() => {
            setResetCount((count) => count + 1);
            setProgress(0);
            setFailurePoint(Math.floor(Math.random() * 40) + 60);
          }, 500);
          return 99;
        }

        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFailed, retryCount, failurePoint]);

  const handleRetry = () => {
    setIsFailed(false);
    setErrorMessage('');
    setProgress(0);
    setRetryCount((prev) => prev + 1);
    setFailurePoint(Math.floor(Math.random() * 40) + 60);
    // Note: intervals will be created by useEffect when isFailed changes to false
  };

  return (
    <div>
      <h3>File Download</h3>
      <ProgressBar progress={progress} decimalPlaces={0} />

      {/* Error UI */}
      {isFailed && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#fee',
          border: '2px solid #f44',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#c00' }}>
                Download Failed
              </div>
              <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
                {errorMessage}
              </div>
            </div>
          </div>
          <button
            onClick={handleRetry}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Retry Download
          </button>
          {retryCount > 0 && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.8em',
              color: '#666',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Failure probability: {Math.min(30 + (retryCount * 15), 90)}%
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666' }}>
        <div>Total attempts: {resetCount + retryCount}</div>
        {retryCount > 0 && <div>Failed attempts: {retryCount}</div>}
        <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
          {isFailed
            ? "Perhaps the file was never meant to be downloaded."
            : "Download in progress..."
          }
        </div>
      </div>
    </div>
  );
}
// Features:
// - Random failure point (60-99%)
// - Escalating failure probability (30% + 15% per retry, max 90%)
// - Retry button that restarts download
// - Error messages from philosophy.js
// - Displays current failure probability
// - Success is still possible but becomes increasingly unlikely
```

### Key Patterns Summary

**Three Distinct Futility Philosophies:**

1. **Asymptotic (Zeno's Paradox)** - Never completes, always approaching
   - Variable decay rates slow progress exponentially
   - Displays 4 decimal places to show infinitesimal progress
   - Formula: `progress + (100 - progress) * decayRate`

2. **Eternal Recurrence** - Completes and resets infinitely
   - Auto-resets at 99% after brief delay
   - Cycle counter tracks iterations
   - Same experience repeated forever

3. **Escalating Failure** - Random failures with increasing probability
   - Failure point randomized each attempt (60-99%)
   - Probability formula: `Math.min(30 + (retryCount * 15), 90)`
   - Success possible but increasingly unlikely
   - Mixed technical/philosophical error messages

## Summary

The Philosophy & Dialogs system provides:
- Inescapable acceptance-based dialogs
- Automatic philosophical notifications
- Circular help documentation
- Interactive error simulation
- Rich philosophical content
- Clean, extensible architecture

The Progress Bar system provides:
- Integer and floating-point percentage display
- Support for asymptotic behaviors (Zeno's Paradox)
- Support for infinite loops and eternal recurrence
- Support for random failure with escalating retry probability
- Configurable decimal places (0-4)
- Smooth, precise progress visualization
- Three distinct philosophical approaches to futility

All components work together to create an absurdist experience where users must accept reality as presented, embrace the meaningless, and find humor in the inevitable.

**"One must imagine Sisyphus happy."** - Albert Camus
