import { useState } from 'react';

const Help = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const sections = {
    home: {
      title: 'SisyphOS Help Center',
      content: (
        <>
          <p style={{ fontStyle: 'italic', opacity: 0.8, marginBottom: 'var(--spacing-lg)' }}>
            "Help is a search for the helper within." - Unknown
          </p>
          <h3 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>
            Table of Contents
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <a href="#getting-started" onClick={(e) => { e.preventDefault(); setCurrentSection('getting-started'); }}>
                Getting Started
              </a>
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <a href="#advanced" onClick={(e) => { e.preventDefault(); setCurrentSection('advanced'); }}>
                Advanced Topics
              </a>
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <a href="#troubleshooting" onClick={(e) => { e.preventDefault(); setCurrentSection('troubleshooting'); }}>
                Troubleshooting
              </a>
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <a href="#help-with-help" onClick={(e) => { e.preventDefault(); setCurrentSection('help-with-help'); }}>
                For Help with Help
              </a>
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <a href="#finding-docs" onClick={(e) => { e.preventDefault(); setCurrentSection('finding-docs'); }}>
                Finding Documentation
              </a>
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <a href="#understanding-errors" onClick={(e) => { e.preventDefault(); setCurrentSection('understanding-errors'); }}>
                Understanding Errors
              </a>
            </li>
          </ul>
        </>
      ),
    },
    'getting-started': {
      title: 'Getting Started',
      content: (
        <>
          <p>Welcome to SisyphOS! To get started with the basics of using this system, you'll need to understand the advanced configuration options first.</p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            For comprehensive information on getting started, please see{' '}
            <a href="#advanced" onClick={(e) => { e.preventDefault(); setCurrentSection('advanced'); }}>
              Advanced Topics
            </a>.
          </p>
          <p style={{ marginTop: 'var(--spacing-md)', fontStyle: 'italic', opacity: 0.7 }}>
            Note: The beginning is best understood after reaching the end.
          </p>
        </>
      ),
    },
    'advanced': {
      title: 'Advanced Topics',
      content: (
        <>
          <p>Advanced topics require a thorough understanding of basic troubleshooting procedures.</p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            Before proceeding with advanced configuration, please familiarize yourself with{' '}
            <a href="#troubleshooting" onClick={(e) => { e.preventDefault(); setCurrentSection('troubleshooting'); }}>
              Troubleshooting
            </a>.
          </p>
          <p style={{ marginTop: 'var(--spacing-md)', fontStyle: 'italic', opacity: 0.7 }}>
            Note: Advanced users are encouraged to start with Getting Started.
          </p>
        </>
      ),
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      content: (
        <>
          <p>If you're experiencing issues with SisyphOS, the best place to start is at the beginning.</p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            For troubleshooting assistance, please consult{' '}
            <a href="#getting-started" onClick={(e) => { e.preventDefault(); setCurrentSection('getting-started'); }}>
              Getting Started
            </a>.
          </p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            <strong>Common Issues:</strong>
          </p>
          <ul>
            <li>Cannot find solution: See Getting Started</li>
            <li>Getting Started unclear: See Advanced Topics</li>
            <li>Advanced Topics confusing: See Troubleshooting</li>
          </ul>
        </>
      ),
    },
    'help-with-help': {
      title: 'For Help with Help',
      content: (
        <>
          <p>If you need assistance using the Help system, the Help system is here to help.</p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            For help with Help, please consult{' '}
            <a href="#help-with-help" onClick={(e) => { e.preventDefault(); setCurrentSection('help-with-help'); }}>
              Help
            </a>.
          </p>
          <p style={{ marginTop: 'var(--spacing-md)', fontStyle: 'italic', opacity: 0.7 }}>
            "The helper helps by being helped to help." - SisyphOS Documentation Team
          </p>
        </>
      ),
    },
    'finding-docs': {
      title: 'Finding Documentation',
      content: (
        <>
          <p>To locate the documentation you're looking for, consult the section on where to find documentation.</p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            Documentation can be found in the{' '}
            <a href="#help-with-help" onClick={(e) => { e.preventDefault(); setCurrentSection('help-with-help'); }}>
              Help system
            </a>.
          </p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            If you cannot find the Help system, see{' '}
            <a href="#finding-docs" onClick={(e) => { e.preventDefault(); setCurrentSection('finding-docs'); }}>
              Finding Documentation
            </a>.
          </p>
        </>
      ),
    },
    'understanding-errors': {
      title: 'Understanding Errors',
      content: (
        <>
          <p>Error messages in SisyphOS are designed to be clear and informative. To understand them, please refer to the error message documentation.</p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            For detailed information about error messages, see{' '}
            <a href="#understanding-errors" onClick={(e) => { e.preventDefault(); setCurrentSection('understanding-errors'); }}>
              Understanding Errors
            </a>.
          </p>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            If you don't understand the error documentation, that is itself an error. See{' '}
            <a href="#understanding-errors" onClick={(e) => { e.preventDefault(); setCurrentSection('understanding-errors'); }}>
              Understanding Errors
            </a>.
          </p>
        </>
      ),
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // All searches return the same result
    setSearchResult('Did you mean: Help?');
  };

  const currentContent = sections[currentSection];

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg-secondary)',
    }}>
      {/* Search bar */}
      <div style={{
        padding: 'var(--spacing-md)',
        borderBottom: '1px solid var(--color-border-light)',
        backgroundColor: 'var(--color-bg-primary)',
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            style={{
              flex: 1,
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
          />
          <button
            type="submit"
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'var(--color-accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
        {searchResult && (
          <div style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'var(--color-accent-warning)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--color-text-primary)',
          }}>
            {searchResult}
          </div>
        )}
      </div>

      {/* Content area */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-lg)',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: '700px' }}>
          {/* Breadcrumb navigation */}
          {currentSection !== 'home' && (
            <div style={{ marginBottom: 'var(--spacing-md)', fontSize: '12px', opacity: 0.7 }}>
              <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentSection('home'); }}>
                Home
              </a>
              {' > '}
              <span>{currentContent.title}</span>
            </div>
          )}

          <h2 style={{
            marginTop: 0,
            marginBottom: 'var(--spacing-lg)',
            fontSize: '24px',
            fontWeight: '600',
          }}>
            {currentContent.title}
          </h2>

          <div style={{
            fontSize: '14px',
            lineHeight: '1.7',
            color: 'var(--color-text-primary)',
          }}>
            {currentContent.content}
          </div>

          {/* Back to home link */}
          {currentSection !== 'home' && (
            <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border-light)' }}>
              <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentSection('home'); }}>
                Back to Table of Contents
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
