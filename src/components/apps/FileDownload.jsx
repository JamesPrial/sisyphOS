import { useState, useEffect, useRef } from 'react';
import ProgressBar from '../ProgressBar';
import { getRandomDownloadError } from '../../data/philosophy';

const FileDownload = () => {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('Calculating...');
  const [resetCount, setResetCount] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [failurePoint, setFailurePoint] = useState(null);
  const intervalRef = useRef(null);
  const speedIntervalRef = useRef(null);

  // Initialize random failure point on mount
  useEffect(() => {
    // Generate random failure point between 60-99%
    setFailurePoint(Math.floor(Math.random() * 40) + 60);
  }, []); // Only on mount

  useEffect(() => {
    // Don't create intervals when in failed state
    if (isFailed) {
      return;
    }

    // Update progress every 200ms (1% increment)
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
            clearInterval(speedIntervalRef.current);
            return failurePoint;
          }
        }

        // Normal reset at 99% (success case)
        if (newProgress >= 99 && !isFailed) {
          setTimeout(() => {
            setResetCount((count) => count + 1);
            setProgress(0);
            setTimeRemaining('Calculating...');
            setFailurePoint(Math.floor(Math.random() * 40) + 60); // New random failure point
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
  }, [isFailed, retryCount, failurePoint]);

  const handleRetry = () => {
    setIsFailed(false);
    setErrorMessage('');
    setProgress(0);
    setRetryCount((prev) => prev + 1);
    setFailurePoint(Math.floor(Math.random() * 40) + 60); // 60-99%
    setTimeRemaining('Calculating...');
    // Note: intervals will be created by useEffect when isFailed changes to false
  };

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

        {/* Attempt Counter */}
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
          Attempts: <span style={{ fontWeight: '700', color: 'var(--color-accent-primary)' }}>
            {resetCount + retryCount}
          </span>
          {retryCount > 0 && (
            <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '4px' }}>
              ({retryCount} failed)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <ProgressBar progress={progress} label="Download Progress" showPercentage={true} />
      </div>

      {/* Error Message - shown when failed */}
      {isFailed && (
        <div
          style={{
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-lg)',
            backgroundColor: '#fee',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--color-accent-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
            <div style={{ fontSize: '32px' }}>⚠️</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-accent-secondary)' }}>
                Download Failed
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {errorMessage}
              </div>
            </div>
          </div>
          <button
            onClick={handleRetry}
            style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'var(--color-accent-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              width: '100%',
            }}
          >
            Retry Download
          </button>
          {retryCount > 0 && (
            <div style={{
              marginTop: 'var(--spacing-sm)',
              fontSize: '11px',
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Failure probability: {Math.min(30 + (retryCount * 15), 90)}%
            </div>
          )}
        </div>
      )}

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
        {isFailed
          ? "Perhaps the file was never meant to be downloaded."
          : "Your download will complete soon. Please be patient... forever."
        }
      </div>
    </div>
  );
};

export default FileDownload;
