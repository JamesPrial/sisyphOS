import { useState } from 'react';
import Dialog from '../Dialog';
import { getRandomAbsurdistError, camusQuotes, getRandomItem } from '../../data/philosophy';

const ErrorSimulator = () => {
  const [errorCount, setErrorCount] = useState(0);
  const [errorType, setErrorType] = useState('existential');
  const [currentDialog, setCurrentDialog] = useState(null);

  const errorTypes = {
    existential: {
      label: 'Existential Error',
      messages: [
        'Error: The meaning you requested could not be allocated.',
        'Fatal exception: Existence has encountered an unexpected condition.',
        'Critical error: Being.sys is incompatible with Nothingness.dll',
        'Error: The essence you are looking for does not precede existence.',
        'System error: Free will has caused an unexpected paradox.',
      ],
    },
    philosophical: {
      label: 'Philosophical Warning',
      messages: [
        'Warning: You are thinking, therefore complications may arise.',
        'Warning: The examined life has detected an inconsistency.',
        'Alert: Your choices have consequences, but not the ones you expect.',
        'Warning: The categorical imperative was violated. Or was it?',
        'Philosophical warning: The cave wall is not what it seems.',
      ],
    },
    absurdist: {
      label: 'Absurdist Exception',
      messages: [
        ...Array(5).fill(null).map(() => getRandomAbsurdistError()),
      ],
    },
    meaningless: {
      label: 'Meaningless Alert',
      messages: [
        'Alert: This message has no purpose.',
        'Notification: Something happened. Or did it?',
        'Alert: The system would like to inform you of nothing in particular.',
        'Notification: This alert exists because alerts must exist.',
        'Message: You are reading this. That is all.',
      ],
    },
  };

  const handleGenerateError = () => {
    const selectedType = errorTypes[errorType];
    const message = getRandomItem(selectedType.messages);

    setCurrentDialog({
      title: selectedType.label,
      message: message,
    });

    setErrorCount(errorCount + 1);
  };

  const handleCloseDialog = () => {
    setCurrentDialog(null);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg-secondary)',
      padding: 'var(--spacing-lg)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: 'var(--spacing-sm)',
          fontSize: '20px',
          fontWeight: '600',
        }}>
          Error Simulator
        </h2>
        <p style={{
          margin: 0,
          fontSize: '13px',
          opacity: 0.8,
          fontStyle: 'italic',
        }}>
          "Error is the force that welds men together." - Adapted from Camus
        </p>
      </div>

      {/* Control Panel */}
      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-light)',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            Error Type:
          </label>
          <select
            value={errorType}
            onChange={(e) => setErrorType(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="existential">Existential Error</option>
            <option value="philosophical">Philosophical Warning</option>
            <option value="absurdist">Absurdist Exception</option>
            <option value="meaningless">Meaningless Alert</option>
          </select>
        </div>

        <button
          onClick={handleGenerateError}
          style={{
            width: '100%',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-accent-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Generate Error
        </button>
      </div>

      {/* Statistics */}
      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-light)',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', opacity: 0.8 }}>Errors Generated:</span>
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--color-accent-secondary)',
          }}>
            {errorCount}
          </span>
        </div>
      </div>

      {/* Information */}
      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        fontSize: '13px',
        lineHeight: '1.6',
      }}>
        <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
          About Error Simulator
        </div>
        <p style={{ margin: 0, marginBottom: 'var(--spacing-sm)' }}>
          Errors are not bugs in SisyphOS - they are features. Each error is a philosophical truth disguised as a system failure.
        </p>
        <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.8 }}>
          Note: All errors can only be acknowledged, never fixed.
        </p>
      </div>

      {/* Random Camus quote at bottom */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 'var(--spacing-lg)',
        fontSize: '12px',
        fontStyle: 'italic',
        opacity: 0.6,
        textAlign: 'center',
      }}>
        "{getRandomItem(camusQuotes)}"
      </div>

      {/* Dialog */}
      {currentDialog && (
        <Dialog
          title={currentDialog.title}
          message={currentDialog.message}
          onOK={handleCloseDialog}
          isOpen={!!currentDialog}
        />
      )}
    </div>
  );
};

export default ErrorSimulator;
