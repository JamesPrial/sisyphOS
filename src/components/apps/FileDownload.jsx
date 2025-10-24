import { useState, useEffect, useRef } from 'react';
import ProgressBar from '../ProgressBar';

const FileDownload = () => {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('Calculating...');
  const [resetCount, setResetCount] = useState(0);
  const intervalRef = useRef(null);
  const speedIntervalRef = useRef(null);

  useEffect(() => {
    // Update progress every 200ms (1% increment)
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;

        // Reset at 99%
        if (newProgress >= 99) {
          setTimeout(() => {
            setResetCount((count) => count + 1);
            setProgress(0);
            setTimeRemaining('Calculating...');
          }, 500);
          return 99;
        }

        // Update time remaining with absurd values
        if (newProgress < 30) {
          setTimeRemaining('Calculating...');
        } else if (newProgress < 60) {
          setTimeRemaining(`${Math.floor(Math.random() * 100) + 50} years remaining`);
        } else if (newProgress < 90) {
          setTimeRemaining(`${Math.floor(Math.random() * 999999)} hours remaining`);
        } else {
          setTimeRemaining('Almost done... maybe');
        }

        return newProgress;
      });
    }, 200);

    // Randomize download speed every 500ms
    speedIntervalRef.current = setInterval(() => {
      const speeds = [0.5, 1.2, 3.4, 5.6, 12.3, 0.1, 24.7, 0.03];
      setSpeed(speeds[Math.floor(Math.random() * speeds.length)]);
    }, 500);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (speedIntervalRef.current) {
        clearInterval(speedIntervalRef.current);
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
        "One must imagine the download completing."
      </div>

      {/* Download Information */}
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
          Downloading File
        </h2>

        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}
        >
          <div style={{ fontSize: '24px' }}>📄</div>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
              }}
            >
              meaning_of_life.pdf
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Size: Unknown
            </div>
          </div>
        </div>

        {/* Download Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)',
          }}
        >
          <div
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
            }}
          >
            <div style={{ color: 'var(--color-text-tertiary)' }}>Speed</div>
            <div style={{ fontWeight: '700', color: 'var(--color-text-primary)', marginTop: '4px' }}>
              {speed.toFixed(2)} MB/s
            </div>
          </div>
          <div
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
            }}
          >
            <div style={{ color: 'var(--color-text-tertiary)' }}>Time Remaining</div>
            <div style={{ fontWeight: '700', color: 'var(--color-text-primary)', marginTop: '4px', fontSize: '11px' }}>
              {timeRemaining}
            </div>
          </div>
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
          Download Restarts: <span style={{ fontWeight: '700', color: 'var(--color-accent-primary)' }}>{resetCount}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <ProgressBar progress={progress} label="Download Progress" showPercentage={true} />
      </div>

      {/* Note */}
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
        Your download will complete soon. Please be patient... forever.
      </div>
    </div>
  );
};

export default FileDownload;
