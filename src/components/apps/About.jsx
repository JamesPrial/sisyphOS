const About = () => {
  return (
    <div
      style={{
        padding: 'var(--spacing-xl)',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: 'var(--spacing-md)', borderBottom: '2px solid var(--color-border-light)' }}>
        <div
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: 'var(--spacing-sm)',
            background: 'linear-gradient(135deg, #5c6bc0 0%, #ec407a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SisyphOS
        </div>
        <div
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
          }}
        >
          Version 1.0.0 (Eternally Beta)
        </div>
      </div>

      {/* Theme */}
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-accent-primary)' }}>
          Theme
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          <strong>Fantasy Operating System - Absurdist Computing</strong>
          <br />
          An exploration of futility, meaning, and the human condition through the lens of a fantasy operating system.
        </p>
      </div>

      {/* Description */}
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-accent-primary)' }}>
          About the Project
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          SisyphOS is inspired by Albert Camus&apos; philosophical essay <em>The Myth of Sisyphus</em>,
          which explores the concept of the absurd - the conflict between humanity&apos;s search for meaning
          and the universe&apos;s apparent meaninglessness. This operating system brings these philosophical
          concepts to life through interactive computing experiences where every action is both futile and essential.
        </p>
      </div>

      {/* Quote */}
      <div
        style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-bg-primary)',
          borderLeft: '4px solid var(--color-accent-secondary)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <p style={{ fontStyle: 'italic', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-xs)' }}>
          &quot;The struggle itself toward the heights is enough to fill a man&apos;s heart.
          One must imagine Sisyphus happy.&quot;
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          — Albert Camus, <em>The Myth of Sisyphus</em>
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-accent-primary)' }}>
          Key Features
        </h3>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', paddingLeft: 'var(--spacing-lg)' }}>
          <li>
            <strong>Boulder Physics</strong> - Desktop icons slowly drift back to their original positions,
            like a boulder rolling down a mountain
          </li>
          <li>
            <strong>Infinite Progress</strong> - Progress bars and system updates that never quite complete
          </li>
          <li>
            <strong>Multiplying Processes</strong> - Task manager where killing processes causes them to multiply
          </li>
          <li>
            <strong>Circular Help System</strong> - Documentation that references itself in endless loops
          </li>
          <li>
            <strong>Desktop Organization</strong> - Organize your desktop, only to watch it slowly return to chaos
          </li>
          <li>
            <strong>Philosophical Notifications</strong> - Periodic reminders of the absurd nature of existence
          </li>
          <li>
            <strong>Happy Mode</strong> - Toggle between accepting the absurd with despair or with joy
          </li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-accent-primary)' }}>
          Technical Stack
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          {['React', 'Zustand', 'Framer Motion', 'React Draggable', 'Vite'].map((tech) => (
            <span
              key={tech}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-md)',
                backgroundColor: 'var(--color-accent-primary)',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '500',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-accent-primary)' }}>
          Credits
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          Created with existential dread and philosophical curiosity.
          <br />
          Philosophical inspiration: Albert Camus
          <br />
          Design philosophy: Minimalism meets absurdism
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border-light)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem',
        }}
      >
        Remember: Every click is both meaningful and meaningless.
        <br />
        One must imagine the developer happy.
      </div>
    </div>
  );
};

export default About;
