import { useState, useEffect } from 'react';
import useOSStore from '../../store/osStore';
import { useDesktopChaos } from '../../hooks/useDesktopChaos';
import { iconHerdingMessages, getIconHerdingGiveUpMessage } from '../../data/philosophy';

const OrganizeDesktop = () => {
  const {
    desktopFiles,
    updateDesktopFilePosition,
    startDesktopChaos,
    stopDesktopChaos,
  } = useOSStore();

  const chaos = useDesktopChaos(desktopFiles, updateDesktopFilePosition);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'active', 'ended'

  // Expose drag handlers globally so BoulderIcon can access them
  useEffect(() => {
    window.__chaosHandlers = {
      onDragStart: chaos.onIconDragStart,
      onDragStop: chaos.onIconDragStop,
      isActive: chaos.isActive,
    };

    return () => {
      delete window.__chaosHandlers;
    };
  }, [chaos.onIconDragStart, chaos.onIconDragStop, chaos.isActive]);

  const handleStart = () => {
    setGameState('active');
    startDesktopChaos();
    chaos.start();
  };

  const handleGiveUp = () => {
    setGameState('ended');
    stopDesktopChaos();
    chaos.stop();
  };

  const handleTryAgain = () => {
    setGameState('idle');
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        gap: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      {/* IDLE STATE - Start Screen */}
      {gameState === 'idle' && (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
              🎯
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-text-primary)',
              }}
            >
              {iconHerdingMessages.start.title}
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              {iconHerdingMessages.start.description}
            </p>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                fontStyle: 'italic',
              }}
            >
              {iconHerdingMessages.start.flavor}
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            style={{
              padding: 'var(--spacing-lg) var(--spacing-xl)',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              boxShadow: 'var(--shadow-lg)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
          >
            Start Herding
          </button>

          {/* Instructions */}
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
              <strong>How to play:</strong> Drag each icon back to its starting position.
              Icons will pause briefly (2-3s) when returned, then resume their chaotic journey.
              They will speed up over time. There is no winning, only acceptance.
            </p>
          </div>
        </>
      )}

      {/* ACTIVE STATE - Playing */}
      {gameState === 'active' && (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
              🌪️
            </div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
              }}
            >
              Chaos in Progress
            </h2>
          </div>

          {/* Live Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            {/* Icons Returned */}
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'var(--color-accent-primary)',
                }}
              >
                {chaos.stats.iconsReturned}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Returned
              </div>
            </div>

            {/* Time Elapsed */}
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'var(--color-accent-secondary)',
                }}
              >
                {formatTime(chaos.stats.timeElapsed)}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Time
              </div>
            </div>

            {/* Max Returned */}
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'rgba(92, 184, 92, 0.8)',
                }}
              >
                {chaos.stats.maxReturned}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Peak Success
              </div>
            </div>

            {/* Chaos Level */}
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'rgba(217, 83, 79, 0.8)',
                }}
              >
                {chaos.stats.peakSpeed.toFixed(1)}x
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Speed
              </div>
            </div>
          </div>

          {/* Attempts Counter */}
          <div
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'rgba(92, 107, 192, 0.05)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
            }}
          >
            Drag attempts: <strong>{chaos.stats.totalAttempts}</strong>
          </div>

          {/* Give Up Button */}
          <button
            onClick={handleGiveUp}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: 'rgba(217, 83, 79, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              boxShadow: 'var(--shadow-md)',
              marginTop: 'var(--spacing-md)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(217, 83, 79, 1)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(217, 83, 79, 0.8)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            Give Up
          </button>
        </>
      )}

      {/* ENDED STATE - Game Over */}
      {gameState === 'ended' && (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
              🏳️
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-text-primary)',
              }}
            >
              Acceptance
            </h2>
          </div>

          {/* Philosophical Message */}
          <div
            style={{
              maxWidth: '450px',
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'rgba(92, 107, 192, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(92, 107, 192, 0.3)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-primary)',
                lineHeight: '1.6',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              "{getIconHerdingGiveUpMessage(chaos.stats)}"
            </p>
          </div>

          {/* Final Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--color-accent-primary)',
                }}
              >
                {chaos.stats.iconsReturned}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Final Returned
              </div>
            </div>

            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--color-accent-secondary)',
                }}
              >
                {formatTime(chaos.stats.timeElapsed)}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Duration
              </div>
            </div>

            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'rgba(92, 184, 92, 0.8)',
                }}
              >
                {chaos.stats.maxReturned}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Peak Success
              </div>
            </div>

            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'rgba(217, 83, 79, 0.8)',
                }}
              >
                {chaos.stats.totalAttempts}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Total Attempts
              </div>
            </div>
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleTryAgain}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              boxShadow: 'var(--shadow-md)',
              marginTop: 'var(--spacing-md)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            Try Again (It Won't Help)
          </button>
        </>
      )}
    </div>
  );
};

export default OrganizeDesktop;
