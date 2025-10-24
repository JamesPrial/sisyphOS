import { useState, useEffect, useRef } from 'react';
import ProgressBar from '../ProgressBar';

const InstallWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completionCount, setCompletionCount] = useState(0);
  const intervalRef = useRef(null);

  const steps = ['Welcome', 'License Agreement', 'Installing', 'Complete'];

  // Handle progress for "Installing" step
  useEffect(() => {
    if (currentStep === 2) {
      // Step 2 is "Installing"
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;

          // Reset at 99%
          if (newProgress >= 99) {
            return 99;
          }

          return newProgress;
        });
      }, 200);
    } else {
      // Clear progress for other steps
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 2 && progress < 99) {
      // Can't proceed from Installing step until 99%
      return;
    }

    if (currentStep === steps.length - 1) {
      // At "Complete" step, loop back to beginning
      setCurrentStep(0);
      setProgress(0);
      setCompletionCount((count) => count + 1);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px' }}>🪨</div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              Welcome to the Installation Wizard
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                maxWidth: '400px',
                lineHeight: '1.6',
              }}
            >
              This wizard will guide you through the installation process.
              Click Next to continue your journey.
            </p>
          </div>
        );

      case 1: // License Agreement
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
              height: '100%',
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
              License Agreement
            </h2>
            <div
              style={{
                flex: 1,
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                overflow: 'auto',
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                fontFamily: 'monospace',
              }}
            >
              <p>TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION</p>
              <p>
                By installing this software, you acknowledge that meaning is self-created,
                and that the completion of this installation is neither guaranteed nor necessary.
              </p>
              <p>
                You agree that all progress is temporary, all achievements fleeting,
                and that the act of installation itself is the only true constant.
              </p>
              <p>
                The software may install successfully, fail gracefully, or perpetually
                attempt installation. All outcomes are equally valid.
              </p>
              <p>
                There is no warranty, express or implied, that this software will ever
                complete installation or provide any meaningful functionality.
              </p>
              <p>
                You accept full responsibility for the eternal recurrence of installation attempts.
              </p>
            </div>
          </div>
        );

      case 2: // Installing
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xl)',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Installing...
            </h2>
            <ProgressBar progress={progress} label="Installation Progress" showPercentage={true} />
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                textAlign: 'center',
              }}
            >
              {progress < 50 && 'Copying files...'}
              {progress >= 50 && progress < 90 && 'Configuring system...'}
              {progress >= 90 && progress < 99 && 'Finalizing installation...'}
              {progress >= 99 && 'Almost there! Click Next to complete.'}
            </p>
          </div>
        );

      case 3: // Complete
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px' }}>✓</div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--color-accent-primary)',
                margin: 0,
              }}
            >
              Installation Complete!
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                maxWidth: '400px',
                lineHeight: '1.6',
              }}
            >
              Success! The software has been installed successfully.
              Click Next to begin again.
            </p>
            <div
              style={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: 'var(--color-text-tertiary)',
                marginTop: 'var(--spacing-md)',
              }}
            >
              "Success is a journey, not a destination."
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'var(--spacing-lg)',
      }}
    >
      {/* Quote at top */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '14px',
          fontStyle: 'italic',
          color: 'var(--color-text-tertiary)',
          borderLeft: '3px solid var(--color-border-light)',
          paddingLeft: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        "Success is a journey, not a destination."
      </div>

      {/* Step Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step}
            style={{
              flex: 1,
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor:
                  index <= currentStep ? 'var(--color-accent-primary)' : 'var(--color-border-light)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--spacing-xs)',
                transition: 'background-color var(--transition-normal)',
              }}
            />
            <div
              style={{
                fontSize: '11px',
                color: index === currentStep ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: index === currentStep ? '600' : '400',
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Counter */}
      {completionCount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <div
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
            }}
          >
            Cycles Completed:{' '}
            <span style={{ fontWeight: '700', color: 'var(--color-accent-primary)' }}>
              {completionCount}
            </span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div style={{ flex: 1, minHeight: 0 }}>{getStepContent()}</div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--spacing-md)',
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border-light)',
        }}
      >
        <button
          onClick={handleNext}
          disabled={currentStep === 2 && progress < 99}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            backgroundColor:
              currentStep === 2 && progress < 99
                ? 'var(--color-border-light)'
                : 'var(--color-accent-primary)',
            color: currentStep === 2 && progress < 99 ? 'var(--color-text-tertiary)' : '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: '600',
            cursor: currentStep === 2 && progress < 99 ? 'not-allowed' : 'pointer',
            border: 'none',
            transition: 'all var(--transition-fast)',
            opacity: currentStep === 2 && progress < 99 ? 0.5 : 1,
          }}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default InstallWizard;
