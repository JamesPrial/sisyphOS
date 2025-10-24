import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dialog = ({
  title,
  message,
  onOK,
  isOpen,
  allowEmpty = false,
  buttons = null,
  initialDelay = null,
}) => {
  const [countdown, setCountdown] = useState(initialDelay);

  useEffect(() => {
    if (!isOpen) return;

    // Disable ESC key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add event listener with capture to catch it before other handlers
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  // Handle countdown timer
  useEffect(() => {
    if (!isOpen || initialDelay === null) {
      setCountdown(initialDelay);
      return;
    }

    // Reset countdown when dialog opens
    setCountdown(initialDelay);

    if (initialDelay === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, initialDelay]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay - clicking does nothing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              // Intentionally do nothing - no closing by clicking outside
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(2px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Dialog box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--color-border-light)',
                minWidth: '400px',
                maxWidth: '600px',
                overflow: 'hidden',
              }}
            >
              {/* Title bar */}
              <div
                style={{
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderBottom: '1px solid var(--color-border-light)',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {title}
                </h3>
              </div>

              {/* Message content - conditional rendering based on allowEmpty */}
              {!allowEmpty && (
                <div
                  style={{
                    padding: 'var(--spacing-xl)',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.6',
                    fontSize: '14px',
                  }}
                >
                  {message}
                </div>
              )}

              {/* Buttons - multiple modes */}
              <div
                style={{
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderTop: '1px solid var(--color-border-light)',
                  display: 'flex',
                  justifyContent: buttons ? 'space-evenly' : 'flex-end',
                  gap: 'var(--spacing-sm)',
                }}
              >
                {buttons ? (
                  // Custom buttons mode
                  buttons.map((button, index) => {
                    const isDisabled = button.disabled || false;
                    return (
                      <button
                        key={index}
                        onClick={button.onClick}
                        disabled={isDisabled}
                        style={{
                          padding: 'var(--spacing-sm) var(--spacing-xl)',
                          backgroundColor: isDisabled
                            ? 'var(--color-bg-tertiary)'
                            : 'var(--color-accent-primary)',
                          color: isDisabled ? 'var(--color-text-secondary)' : 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all var(--transition-fast)',
                          minWidth: '80px',
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isDisabled) {
                            e.target.style.backgroundColor = 'var(--color-accent-primary-hover)';
                            e.target.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDisabled) {
                            e.target.style.backgroundColor = 'var(--color-accent-primary)';
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {button.label}
                      </button>
                    );
                  })
                ) : (
                  // Default OK button mode
                  <button
                    onClick={onOK}
                    disabled={countdown > 0}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-xl)',
                      backgroundColor:
                        countdown > 0 ? 'var(--color-bg-tertiary)' : 'var(--color-accent-primary)',
                      color: countdown > 0 ? 'var(--color-text-secondary)' : 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                      transition: 'all var(--transition-fast)',
                      minWidth: '80px',
                      opacity: countdown > 0 ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (countdown === 0) {
                        e.target.style.backgroundColor = 'var(--color-accent-primary-hover)';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (countdown === 0) {
                        e.target.style.backgroundColor = 'var(--color-accent-primary)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {countdown > 0 ? `OK (${countdown}s)` : 'OK'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
