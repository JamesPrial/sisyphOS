import React, { useState } from 'react';
import { useOSStore } from '../../store/osStore';
import '../../styles/FileSystemLogin.css';

export function FileSystemLogin({ onLoginSuccess }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginVFS } = useOSStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Use /api/login endpoint with Content-Type: text/plain to avoid CORS preflight
    try {
      const response = await fetch('https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: apiKey,
      });

      const data = await response.json();

      if (data.success) {
        // Valid API key - store it and notify parent
        loginVFS(apiKey);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else if (response.status === 401) {
        setError('Invalid API key. Please try again.');
      } else {
        setError(data.error || 'Connection error. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to file system. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-system-login">
      <div className="login-container">
        <h2>🔒 File System Authentication</h2>
        <p className="login-description">
          Enter the API key to access the file system.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="api-key">API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key..."
              autoFocus
              disabled={loading}
              className="api-key-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!apiKey || loading}
            className="login-button"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="login-hint">
          <small>Hint: Contact the administrator for the API key</small>
        </div>
      </div>
    </div>
  );
}
