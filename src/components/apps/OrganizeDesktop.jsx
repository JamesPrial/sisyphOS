import { useState, useEffect, useRef } from 'react';
import useOSStore from '../../store/osStore';

const OrganizeDesktop = () => {
  const { organizeDesktop, resetDesktopPositions, organizationAttempts } = useOSStore();
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [entropyProgress, setEntropyProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const entropyTimeoutRef = useRef(null);
  const entropyIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (entropyTimeoutRef.current) clearTimeout(entropyTimeoutRef.current);
      if (entropyIntervalRef.current) clearInterval(entropyIntervalRef.current);
    };
  }, []);

  const handleOrganize = () => {
    // Organize the desktop
    organizeDesktop();
    setIsOrganizing(true);
    setShowSuccess(true);
    setEntropyProgress(0);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    // Start entropy progress bar
    const progressDuration = 5000; // 5 seconds
    const intervalTime = 50; // Update every 50ms
    const steps = progressDuration / intervalTime;
    let currentStep = 0;

    entropyIntervalRef.current = setInterval(() => {
      currentStep++;
      setEntropyProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(entropyIntervalRef.current);
      }
    }, intervalTime);

    // After 5 seconds, trigger drift-back
    entropyTimeoutRef.current = setTimeout(() => {
      resetDesktopPositions();
      setIsOrganizing(false);
      setEntropyProgress(0);
    }, progressDuration);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 'var(--spacing-xl)',
        gap: 'var(--spacing-xl)',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '500px',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          🗂️
        </div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--color-text-primary)',
          }}
        >
          Desktop Organization Tool
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            fontStyle: 'italic',
          }}
        >
          "The absurd is the essential concept and the first truth." - Camus
        </p>
      </div>

      {/* Organize Button */}
      <button
        onClick={handleOrganize}
        disabled={isOrganizing}
        style={{
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          fontSize: '18px',
          fontWeight: '600',
          backgroundColor: isOrganizing
            ? 'var(--color-border-light)'
            : 'var(--color-accent-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: isOrganizing ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-normal)',
          boxShadow: isOrganizing ? 'none' : 'var(--shadow-lg)',
          transform: isOrganizing ? 'scale(0.95)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!isOrganizing) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = 'var(--shadow-xl)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOrganizing) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }
        }}
      >
        {isOrganizing ? 'Organizing...' : 'Organize Desktop'}
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'rgba(92, 184, 92, 0.1)',
            border: '1px solid rgba(92, 184, 92, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            fontWeight: '500',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          Desktop organized!
        </div>
      )}

      {/* Entropy Progress */}
      {isOrganizing && (
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                fontWeight: '500',
              }}
            >
              Entropy increasing...
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-accent-secondary)',
                fontWeight: '600',
              }}
            >
              {Math.round(entropyProgress)}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${entropyProgress}%`,
                height: '100%',
                backgroundColor: 'var(--color-accent-secondary)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* Statistics */}
      <div
        style={{
          marginTop: 'auto',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-light)',
          minWidth: '250px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--color-accent-primary)',
            marginBottom: 'var(--spacing-xs)',
          }}
        >
          {organizationAttempts}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Organization Attempts
        </div>
      </div>

      {/* Philosophical Note */}
      <div
        style={{
          maxWidth: '400px',
          textAlign: 'center',
          padding: 'var(--spacing-md)',
          backgroundColor: 'rgba(92, 107, 192, 0.05)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-border-light)',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          The desktop seeks equilibrium. Order is temporary. Chaos is inevitable.
          Yet we organize again, finding meaning in the struggle itself.
        </p>
      </div>
    </div>
  );
};

export default OrganizeDesktop;
