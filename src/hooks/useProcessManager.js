import { useState, useEffect, useRef, useCallback } from 'react';

const INITIAL_PROCESSES = [
  { name: 'sisyphus.exe', icon: '🪨', baseCPU: 15, baseMemory: 120 },
  { name: 'meaning_finder.exe', icon: '🔍', baseCPU: 22, baseMemory: 85 },
  { name: 'hope.exe', icon: '✨', baseCPU: 8, baseMemory: 50 },
  { name: 'boulder_pusher.exe', icon: '💪', baseCPU: 28, baseMemory: 180 },
  { name: 'absurdity_engine.exe', icon: '🌀', baseCPU: 18, baseMemory: 145 },
  { name: 'existence.exe', icon: '🌍', baseCPU: 12, baseMemory: 95 },
  { name: 'purpose_scanner.exe', icon: '🎯', baseCPU: 25, baseMemory: 160 },
  { name: 'futility_daemon.exe', icon: '♾️', baseCPU: 20, baseMemory: 110 },
];

const useProcessManager = () => {
  const [processes, setProcesses] = useState([]);
  const [totalKills, setTotalKills] = useState(0);
  const respawnTimeouts = useRef(new Map());
  const nextProcessId = useRef(0);

  // Initialize processes on mount
  useEffect(() => {
    const initialProcesses = INITIAL_PROCESSES.map((proc, index) => ({
      id: `process-${nextProcessId.current++}`,
      name: proc.name,
      icon: proc.icon,
      baseCPU: proc.baseCPU,
      baseMemory: proc.baseMemory,
      cpu: proc.baseCPU + Math.random() * 5, // Slight randomization
      memory: proc.baseMemory + Math.floor(Math.random() * 20),
      status: 'Running',
      killCount: 0,
      isRespawning: false,
    }));
    setProcesses(initialProcesses);

    // Cleanup timeouts on unmount
    return () => {
      respawnTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      respawnTimeouts.current.clear();
    };
  }, []);

  // Calculate total system resources
  const calculateTotalResources = useCallback(() => {
    const totalCPU = processes.reduce((sum, proc) => {
      return proc.status === 'Running' ? sum + proc.cpu : sum;
    }, 0);
    const totalMemory = processes.reduce((sum, proc) => {
      return proc.status === 'Running' ? sum + proc.memory : sum;
    }, 0);
    return { totalCPU, totalMemory };
  }, [processes]);

  // Kill a process (triggers respawn)
  const killProcess = useCallback((processId) => {
    setProcesses((prevProcesses) => {
      const process = prevProcesses.find((p) => p.id === processId);
      if (!process || process.isRespawning) return prevProcesses;

      const newKillCount = process.killCount + 1;

      // Mark as respawning
      const updatedProcesses = prevProcesses.map((p) =>
        p.id === processId
          ? { ...p, status: 'Respawning...', isRespawning: true }
          : p
      );

      // Schedule respawn
      const timeout = setTimeout(() => {
        setProcesses((currentProcesses) => {
          const processToRespawn = currentProcesses.find((p) => p.id === processId);
          if (!processToRespawn) return currentProcesses;

          // Increase CPU and Memory after respawn
          const cpuIncrease = 10 + Math.random() * 10; // 10-20% increase
          const memoryIncrease = 30 + Math.floor(Math.random() * 20); // 30-50 MB increase

          const newCPU = Math.min(processToRespawn.cpu + cpuIncrease, 99.9);
          const newMemory = processToRespawn.memory + memoryIncrease;

          // Check if we need to multiply (after 3 kills)
          if (newKillCount >= 3 && newKillCount % 3 === 0) {
            // Create a clone
            const clone = {
              id: `process-${nextProcessId.current++}`,
              name: processToRespawn.name.replace(' (Clone)', '') + ' (Clone)',
              icon: processToRespawn.icon,
              baseCPU: processToRespawn.baseCPU,
              baseMemory: processToRespawn.baseMemory,
              cpu: newCPU * 0.8 + Math.random() * 5,
              memory: Math.floor(newMemory * 0.8) + Math.floor(Math.random() * 20),
              status: 'Running',
              killCount: 0,
              isRespawning: false,
            };

            // Respawn original with increased stats
            const respawnedProcess = {
              ...processToRespawn,
              cpu: newCPU,
              memory: newMemory,
              status: 'Running',
              killCount: newKillCount,
              isRespawning: false,
            };

            return currentProcesses.map((p) =>
              p.id === processId ? respawnedProcess : p
            ).concat(clone);
          } else {
            // Normal respawn with increased stats
            return currentProcesses.map((p) =>
              p.id === processId
                ? {
                    ...p,
                    cpu: newCPU,
                    memory: newMemory,
                    status: 'Running',
                    killCount: newKillCount,
                    isRespawning: false,
                  }
                : p
            );
          }
        });

        respawnTimeouts.current.delete(processId);
      }, 500); // 500ms respawn delay

      respawnTimeouts.current.set(processId, timeout);
      return updatedProcesses;
    });

    setTotalKills((prev) => prev + 1);
  }, []);

  // Kill all processes (chaos mode)
  const killAllProcesses = useCallback(() => {
    processes.forEach((process) => {
      if (process.status === 'Running' && !process.isRespawning) {
        killProcess(process.id);
      }
    });
  }, [processes, killProcess]);

  // Sort processes by a given field
  const sortProcesses = useCallback((field) => {
    setProcesses((prevProcesses) => {
      const sorted = [...prevProcesses].sort((a, b) => {
        if (field === 'cpu') {
          return b.cpu - a.cpu;
        } else if (field === 'memory') {
          return b.memory - a.memory;
        } else if (field === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
      return sorted;
    });
  }, []);

  const { totalCPU, totalMemory } = calculateTotalResources();

  return {
    processes,
    totalKills,
    totalCPU,
    totalMemory,
    killProcess,
    killAllProcesses,
    sortProcesses,
  };
};

export default useProcessManager;
