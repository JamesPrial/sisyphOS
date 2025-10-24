import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Component error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-secondary)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
            ⚠️
          </div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-accent-secondary)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-md)',
              maxWidth: '400px',
            }}
          >
            This component encountered an error. Check the console for details.
          </p>
          {this.state.error && (
            <details
              style={{
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
                textAlign: 'left',
                width: '100%',
                maxWidth: '500px',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'auto',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                Error Details
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
