import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, label, showPercentage = true }) => {
  // Color transitions: green -> yellow -> red
  const getProgressColor = (value) => {
    if (value < 50) {
      // Green to yellow (0-50%)
      const ratio = value / 50;
      return `rgb(${Math.round(34 + ratio * 187)}, ${Math.round(197 + ratio * 7)}, ${Math.round(94 - ratio * 60)})`;
    } else if (value < 90) {
      // Yellow to orange (50-90%)
      const ratio = (value - 50) / 40;
      return `rgb(${Math.round(221 + ratio * 18)}, ${Math.round(204 - ratio * 70)}, ${Math.round(34 - ratio * 34)})`;
    } else {
      // Orange to red (90-100%)
      const ratio = (value - 90) / 10;
      return `rgb(${Math.round(239 + ratio * 0)}, ${Math.round(134 - ratio * 75)}, ${Math.round(0)})`;
    }
  };

  const progressColor = getProgressColor(progress);

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xs)',
            fontWeight: '500',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '28px',
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-light)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
          style={{
            height: '100%',
            backgroundColor: progressColor,
            borderRadius: 'var(--radius-sm)',
            boxShadow: progress > 0 ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        />
        {showPercentage && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '12px',
              fontWeight: '700',
              color: progress > 50 ? '#ffffff' : 'var(--color-text-primary)',
              textShadow: progress > 50 ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
              mixBlendMode: progress > 50 ? 'normal' : 'difference',
            }}
          >
            {Math.round(progress)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
