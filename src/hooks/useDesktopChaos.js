import { useEffect, useRef, useState } from 'react';

/**
 * useDesktopChaos - A hook for chaotic desktop icon movement minigame
 *
 * Icons move in random directions with increasing speed, randomly changing
 * direction every few seconds. When dragged back to their starting position,
 * they pause briefly (2-3s) before resuming their chaotic journey.
 *
 * This is a futile minigame - you can never truly win, only give up.
 */
export function useDesktopChaos(desktopFiles, updatePosition) {
  const [isActive, setIsActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [stats, setStats] = useState({
    timeElapsed: 0,
    iconsReturned: 0,
    maxReturned: 0,
    totalAttempts: 0,
    peakSpeed: 1,
  });

  const animationFrameRef = useRef(null);
  const iconStatesRef = useRef(new Map()); // Per-icon state
  const startTimeRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const draggedIconRef = useRef(null); // Currently dragged icon ID
  const desktopFilesRef = useRef(desktopFiles); // Keep current reference

  // Update the ref whenever desktopFiles changes
  useEffect(() => {
    desktopFilesRef.current = desktopFiles;
  }, [desktopFiles]);

  // Initialize icon states
  const initializeIconStates = () => {
    const states = new Map();
    const now = Date.now();
    const currentFiles = desktopFilesRef.current;

    currentFiles.forEach(file => {
      const angle = Math.random() * Math.PI * 2;
      const initialSpeed = 1 + Math.random() * 0.5; // 1-1.5 px/frame

      states.set(file.id, {
        vx: Math.cos(angle) * initialSpeed,
        vy: Math.sin(angle) * initialSpeed,
        baseSpeed: initialSpeed,
        nextDirectionChange: now + 2000 + Math.random() * 2000, // 2-4s
        pauseUntil: 0, // Timestamp when pause ends
        isReturned: false,
        edgeBehavior: null, // Will be set on first collision
      });
    });

    return states;
  };

  // Calculate distance between two points
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Get screen bounds (approximate desktop area)
  const getScreenBounds = () => {
    return {
      minX: 0,
      minY: 0,
      maxX: window.innerWidth - 100, // Leave space for icon
      maxY: window.innerHeight - 150, // Leave space for taskbar + icon
    };
  };

  // Handle edge collision (bounce or wrap)
  const handleEdgeCollision = (state, x, y, bounds) => {
    let newX = x;
    let newY = y;
    let vx = state.vx;
    let vy = state.vy;

    // Determine edge behavior on first collision (then stick with it)
    if (state.edgeBehavior === null) {
      state.edgeBehavior = Math.random() < 0.5 ? 'bounce' : 'wrap';
    }

    // Horizontal boundaries
    if (x <= bounds.minX || x >= bounds.maxX) {
      if (state.edgeBehavior === 'bounce') {
        vx = -vx;
        newX = x <= bounds.minX ? bounds.minX : bounds.maxX;
      } else {
        // Wrap
        newX = x <= bounds.minX ? bounds.maxX : bounds.minX;
      }
    }

    // Vertical boundaries
    if (y <= bounds.minY || y >= bounds.maxY) {
      if (state.edgeBehavior === 'bounce') {
        vy = -vy;
        newY = y <= bounds.minY ? bounds.minY : bounds.maxY;
      } else {
        // Wrap
        newY = y <= bounds.minY ? bounds.maxY : bounds.minY;
      }
    }

    return { newX, newY, vx, vy };
  };

  // Change icon direction randomly
  const changeDirection = (state) => {
    const angle = Math.random() * Math.PI * 2;
    state.vx = Math.cos(angle) * state.baseSpeed;
    state.vy = Math.sin(angle) * state.baseSpeed;
    state.nextDirectionChange = Date.now() + 2000 + Math.random() * 2000; // Next change in 2-4s
  };

  // Animation loop
  const animate = () => {
    const now = Date.now();
    lastUpdateRef.current = now;

    const bounds = getScreenBounds();
    const states = iconStatesRef.current;
    const currentFiles = desktopFilesRef.current; // Use current ref value
    let returnedCount = 0;

    // Gradual speed increase every second
    const secondsElapsed = (now - startTimeRef.current) / 1000;
    const speedMultiplier = Math.min(1 + secondsElapsed * 0.05, 8); // Cap at 8x

    currentFiles.forEach(file => {
      const state = states.get(file.id);
      if (!state) return;

      // Skip if being dragged
      if (draggedIconRef.current === file.id) return;

      // Check if paused (after being returned)
      if (now < state.pauseUntil) {
        if (state.isReturned) returnedCount++;
        return;
      }

      // Resume movement after pause
      if (state.isReturned && now >= state.pauseUntil) {
        state.isReturned = false;
        changeDirection(state); // New random direction
        state.edgeBehavior = null; // Reset edge behavior for variety
      }

      // Check if it's time to change direction
      if (now >= state.nextDirectionChange) {
        changeDirection(state);
      }

      // Apply speed multiplier to base speed
      state.baseSpeed = (1 + Math.random() * 0.5) * speedMultiplier;

      // Update velocity magnitudes
      const currentAngle = Math.atan2(state.vy, state.vx);
      state.vx = Math.cos(currentAngle) * state.baseSpeed;
      state.vy = Math.sin(currentAngle) * state.baseSpeed;

      // Calculate new position
      let newX = file.x + state.vx;
      let newY = file.y + state.vy;

      // Handle edge collisions
      const collision = handleEdgeCollision(state, newX, newY, bounds);
      newX = collision.newX;
      newY = collision.newY;
      state.vx = collision.vx;
      state.vy = collision.vy;

      // Check if icon has returned to starting position
      const dist = distance(newX, newY, file.originalX, file.originalY);
      if (dist < 50 && !state.isReturned) {
        // Icon has been returned!
        state.isReturned = true;
        state.vx = 0;
        state.vy = 0;
        state.pauseUntil = now + 2000 + Math.random() * 1000; // 2-3 second pause
        returnedCount++;

        // Update position to exactly the original spot
        newX = file.originalX;
        newY = file.originalY;
      }

      // Update position in store
      updatePosition(file.id, newX, newY);
    });

    // Update stats
    setStats(prev => ({
      timeElapsed: Math.floor((now - startTimeRef.current) / 1000),
      iconsReturned: returnedCount,
      maxReturned: Math.max(prev.maxReturned, returnedCount),
      totalAttempts: prev.totalAttempts,
      peakSpeed: Math.max(prev.peakSpeed, speedMultiplier),
    }));

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Start the chaos
  const start = () => {
    setIsActive(true);
    setGameEnded(false);
    setStats({
      timeElapsed: 0,
      iconsReturned: 0,
      maxReturned: 0,
      totalAttempts: 0,
      peakSpeed: 1,
    });
    startTimeRef.current = Date.now();
    lastUpdateRef.current = Date.now();
    iconStatesRef.current = initializeIconStates();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Stop the chaos
  const stop = () => {
    setIsActive(false);
    setGameEnded(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Track when user drags an icon (increment attempts)
  const onIconDragStart = (fileId) => {
    draggedIconRef.current = fileId;
    if (isActive) {
      setStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
      }));
    }
  };

  const onIconDragStop = () => {
    draggedIconRef.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isActive,
    gameEnded,
    stats,
    start,
    stop,
    onIconDragStart,
    onIconDragStop,
  };
}
