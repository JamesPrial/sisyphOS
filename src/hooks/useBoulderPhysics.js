import { useEffect, useRef, useState } from 'react';

/**
 * useBoulderPhysics - Custom hook for Sisyphean drift-back mechanics
 *
 * After a file is dragged, it waits 2 seconds then slowly drifts back
 * to its original position over 3-4 seconds with natural easing.
 *
 * Files closer to their origin drift back faster, creating a sense
 * of inexorable gravity pulling them back to their fate.
 */
const useBoulderPhysics = (
  fileId,
  currentPosition,
  originalPosition,
  updatePosition
) => {
  const [isDrifting, setIsDrifting] = useState(false);
  const [rotation, setRotation] = useState(0);
  const driftTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const startPositionRef = useRef(null);

  // Cubic bezier easing function for natural deceleration
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Calculate distance from origin (for distance-based drift speed)
  const calculateDistance = (pos1, pos2) => {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Stop any ongoing drift animation
  const stopDrift = () => {
    if (driftTimeoutRef.current) {
      clearTimeout(driftTimeoutRef.current);
      driftTimeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsDrifting(false);
    setRotation(0);
    startTimeRef.current = null;
  };

  // Start the drift-back animation
  const startDriftBack = () => {
    if (!originalPosition || !currentPosition) return;

    // Check if already at original position (within 1px tolerance)
    const distance = calculateDistance(currentPosition, originalPosition);
    if (distance < 1) {
      stopDrift();
      return;
    }

    // Calculate drift duration based on distance (3-4 seconds)
    // Closer files drift back slightly faster
    const baseDuration = 3000; // 3 seconds
    const maxDuration = 4000; // 4 seconds
    const maxDistance = 500; // pixels
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    const driftDuration = baseDuration + (normalizedDistance * (maxDuration - baseDuration));

    startPositionRef.current = { ...currentPosition };
    startTimeRef.current = Date.now();
    setIsDrifting(true);

    // Animation loop
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / driftDuration, 1);
      const easedProgress = easeOutCubic(progress);

      // Calculate new position
      const newX =
        startPositionRef.current.x +
        (originalPosition.x - startPositionRef.current.x) * easedProgress;
      const newY =
        startPositionRef.current.y +
        (originalPosition.y - startPositionRef.current.y) * easedProgress;

      // Update position
      updatePosition(fileId, newX, newY);

      // Calculate rotation for "rolling boulder" effect
      // Rotation slows down as it approaches destination
      const rotationSpeed = (1 - easedProgress) * 2; // degrees per frame
      setRotation((prev) => prev + rotationSpeed);

      // Continue animation or stop
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Snap to exact position at the end
        updatePosition(fileId, originalPosition.x, originalPosition.y);
        stopDrift();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle drag stop - wait 2 seconds then start drift-back
  const onDragStop = () => {
    stopDrift();

    // Wait 2 seconds before starting drift
    driftTimeoutRef.current = setTimeout(() => {
      startDriftBack();
    }, 2000);
  };

  // Handle drag start - stop any ongoing drift
  const onDragStart = () => {
    stopDrift();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDrift();
    };
  }, []);

  return {
    isDrifting,
    rotation,
    onDragStart,
    onDragStop,
    startDriftBack, // Exposed for manual triggering (e.g., organize desktop)
    stopDrift,
  };
};

export default useBoulderPhysics;
