import { useState, useEffect, useRef } from 'react';
import ProgressBar from '../ProgressBar';

const SystemUpdate = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing...');
  const [resetCount, setResetCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Update progress every 200ms (1% increment)
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;

        // Update status messages based on progress
        if (newProgress < 20) {
          setStatus('Preparing...');
        } else if (newProgress < 60) {
          setStatus('Installing updates...');
        } else if (newProgress < 99) {
          setStatus('Finalizing...');
        } else if (newProgress === 99) {
          // At 99%, show completing message briefly
          setStatus('Almost there...');
        }

        // Reset at 99%
        if (newProgress >= 99) {
          setTimeout(() => {
            setStatus('Starting over...');
            setResetCount((count) => count + 1);
            setProgress(0);
          }, 500);
          return 99;
        }

        return newProgress;
      });
    }, 200);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        height: '100%',
      }}
    >
      {/* Philosophical Quote */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '14px',
          fontStyle: 'italic',
          color: 'var(--color-text-tertiary)',
          borderLeft: '3px solid var(--color-border-light)',
          paddingLeft: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        "The struggle itself toward the heights is enough to fill a man's heart." - Camus
      </div>

      {/* Update Information */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          System Update in Progress
        </h2>

        <div
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Status: <span style={{ fontWeight: '500' }}>{status}</span>
        </div>

        {/* Reset Counter */}
        <div
          style={{
            display: 'inline-block',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            alignSelf: 'flex-start',
          }}
        >
          Update Attempts: <span style={{ fontWeight: '700', color: 'var(--color-accent-primary)' }}>{resetCount}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <ProgressBar progress={progress} label="Installing Updates" showPercentage={true} />
      </div>

      {/* Warning Message */}
      <div
        style={{
          marginTop: 'auto',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-light)',
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
        }}
      >
        Do not turn off your computer. Updates will continue indefinitely.
      </div>
    </div>
  );
};

export default SystemUpdate;
