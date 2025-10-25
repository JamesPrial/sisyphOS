import { useState, useEffect, useRef } from 'react';
import ProgressBar from '../ProgressBar';

const SystemUpdate = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing...');
  const intervalRef = useRef(null);

  // Zeno's paradox: decay rate determines how much of the remaining distance to cover
  const getDecayRate = (progress) => {
    if (progress < 50) return 0.5;       // Moderate initial progress
    if (progress < 80) return 0.2;       // Noticeable slowdown
    if (progress < 95) return 0.05;      // Very slow
    if (progress < 99) return 0.01;      // Extremely slow
    if (progress < 99.9) return 0.001;   // Painfully slow
    return 0.0001;                        // Glacially slow at 99.9%+
  };

  useEffect(() => {
    // Update progress every 200ms using asymptotic formula
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const decayRate = getDecayRate(prev);
        // Asymptotic formula: cover a fraction of the remaining distance
        const newProgress = prev + (100 - prev) * decayRate;

        // Update status messages based on progress
        if (newProgress < 20) {
          setStatus('Preparing...');
        } else if (newProgress < 60) {
          setStatus('Installing updates...');
        } else if (newProgress < 90) {
          setStatus('Finalizing...');
        } else if (newProgress < 99) {
          setStatus('Approaching completion...');
        } else if (newProgress < 99.9) {
          setStatus('Almost there...');
        } else {
          setStatus('So close...');
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
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <ProgressBar progress={progress} label="Installing Updates" showPercentage={true} decimalPlaces={4} />
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
