// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const WelcomeScreen = ({ onEnter }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(55, 71, 79, 0.98)',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl)',
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          maxWidth: '700px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        {/* Logo/Title */}
        <div
          style={{
            fontSize: '4rem',
            fontWeight: '700',
            marginBottom: 'var(--spacing-md)',
            background: 'linear-gradient(135deg, #e8eaf6 0%, #fce4ec 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SisyphOS
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: '400',
            marginBottom: 'var(--spacing-xl)',
            color: '#b0bec5',
            letterSpacing: '0.05em',
          }}
        >
          A Fantasy Operating System
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            marginBottom: 'var(--spacing-xl)',
            color: '#cfd8dc',
          }}
        >
          Inspired by Albert Camus&apos; essay <em>The Myth of Sisyphus</em>,
          this operating system explores the absurdity of computing through
          tasks that are eternally futile yet strangely meaningful.
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            fontSize: '1.1rem',
            fontStyle: 'italic',
            marginBottom: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            borderLeft: '3px solid #ec407a',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-sm)',
            color: '#e8eaf6',
          }}
        >
          &quot;One must imagine Sisyphus happy.&quot;
          <div
            style={{
              fontSize: '0.9rem',
              marginTop: 'var(--spacing-sm)',
              color: '#b0bec5',
            }}
          >
            — Albert Camus
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'left',
          }}
        >
          <div style={{ color: '#cfd8dc', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: '600', color: '#fce4ec' }}>
              Files that return home
            </span>
            <br />
            No matter where you move them
          </div>
          <div style={{ color: '#cfd8dc', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: '600', color: '#fce4ec' }}>
              Progress that never completes
            </span>
            <br />
            Updates that update nothing
          </div>
          <div style={{ color: '#cfd8dc', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: '600', color: '#fce4ec' }}>
              Processes that multiply
            </span>
            <br />
            The more you kill, the more appear
          </div>
          <div style={{ color: '#cfd8dc', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: '600', color: '#fce4ec' }}>
              Claude Camus - Your AI guide
            </span>
            <br />
            An advisor who&apos;s just as lost as you are
          </div>
          <div style={{ color: '#cfd8dc', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: '600', color: '#fce4ec' }}>
              Virtual File System
            </span>
            <br />
            Files that escalate into chaos over time
          </div>
          <div style={{ color: '#cfd8dc', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: '600', color: '#fce4ec' }}>
              Help that helps nothing
            </span>
            <br />
            Documentation in infinite loops
          </div>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          style={{
            padding: 'var(--spacing-md) var(--spacing-xl)',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: '#ec407a',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(236, 64, 122, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          Enter SisyphOS
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
