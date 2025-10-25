import { motion, AnimatePresence } from 'framer-motion';
import { getRandomClippyTip } from '../data/philosophy';
import useOSStore from '../store/osStore';

/**
 * Clippy Assistant - Context-aware pop-up helper
 *
 * Appears when users struggle with futile tasks, offering
 * "helpful" absurdist advice. Like the original Clippy,
 * but with existentialist wisdom.
 */
const ClippyAssistant = () => {
  const { clippyState, dismissClippy } = useOSStore();

  if (!clippyState.isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 50, y: 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '280px',
          backgroundColor: 'var(--color-bg-primary)',
          border: '2px solid var(--color-accent-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          padding: 'var(--spacing-md)',
          zIndex: 10000, // Above everything
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
        }}
      >
        {/* Header with Clippy character */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--spacing-sm)',
        }}>
          {/* Clippy character */}
          <div style={{
            fontSize: '32px',
            lineHeight: '1',
            animation: 'clippy-bounce 2s ease-in-out infinite',
          }}>
            📎
          </div>

          {/* Message content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xs)',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}>
              It looks like you're struggling!
            </div>

            <div style={{
              fontSize: '12px',
              lineHeight: '1.5',
              color: 'var(--color-text-secondary)',
            }}>
              {clippyState.message || getRandomClippyTip()}
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismissClippy}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '2px',
              color: 'var(--color-text-tertiary)',
              lineHeight: '1',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-tertiary)'}
          >
            ✕
          </button>
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xs)',
          marginTop: 'var(--spacing-xs)',
        }}>
          <button
            onClick={dismissClippy}
            style={{
              flex: 1,
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--color-accent-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Accept Futility
          </button>

          <button
            onClick={dismissClippy}
            style={{
              flex: 1,
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
          >
            Try Anyway
          </button>
        </div>

        {/* Footer note */}
        {clippyState.context && (
          <div style={{
            fontSize: '10px',
            fontStyle: 'italic',
            color: 'var(--color-text-tertiary)',
            marginTop: 'var(--spacing-xs)',
            textAlign: 'center',
          }}>
            {clippyState.context}
          </div>
        )}

        {/* CSS animation */}
        <style>{`
          @keyframes clippy-bounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-5deg); }
            50% { transform: translateY(0) rotate(5deg); }
            75% { transform: translateY(-2px) rotate(-3deg); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClippyAssistant;
