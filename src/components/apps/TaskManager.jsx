import { useState, useEffect } from 'react';
import useProcessManager from '../../hooks/useProcessManager';
import useOSStore from '../../store/osStore';
import { getRandomClippyTip } from '../../data/philosophy';

const TaskManager = () => {
  const { showClippy } = useOSStore();
  const {
    processes,
    totalKills,
    totalCPU,
    totalMemory,
    killProcess,
    killAllProcesses,
    sortProcesses,
  } = useProcessManager();

  const [showMultiplyMessage, setShowMultiplyMessage] = useState(false);
  const [sortField, setSortField] = useState(null);

  // Trigger Clippy after 5 process kills
  useEffect(() => {
    if (totalKills >= 5) {
      showClippy(
        getRandomClippyTip(),
        `Processes killed: ${totalKills}`
      );
    }
  }, [totalKills, showClippy]);

  // Handle process kill with visual feedback
  const handleKillProcess = (processId, killCount) => {
    killProcess(processId);

    // Show multiplication message on 3rd, 6th, 9th kill
    if ((killCount + 1) % 3 === 0) {
      setShowMultiplyMessage(true);
      setTimeout(() => setShowMultiplyMessage(false), 2500);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    setSortField(field);
    sortProcesses(field);
  };

  // Get color for CPU/Memory based on percentage
  const getResourceColor = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage > 70) return 'var(--color-accent-secondary)';
    if (percentage > 40) return '#f39c12'; // Yellow
    return 'var(--color-text-secondary)';
  };

  // Get background color for high usage
  const getResourceBgColor = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage > 70) return 'rgba(220, 53, 69, 0.1)';
    if (percentage > 40) return 'rgba(243, 156, 18, 0.1)';
    return 'transparent';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg-secondary)',
        fontFamily: 'monospace',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: 'var(--spacing-md)',
          borderBottom: '2px solid var(--color-border-light)',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        {/* Quote */}
        <div
          style={{
            fontSize: '11px',
            fontStyle: 'italic',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-sm)',
            fontFamily: 'serif',
          }}
        >
          "There is no fate that cannot be surmounted by scorn." - Camus
        </div>

        {/* Warning Banner */}
        <div
          style={{
            padding: 'var(--spacing-sm)',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--color-accent-secondary)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          ⚠️ Terminating processes may cause system instability
        </div>

        {/* System Resources */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <div
            style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Total CPU
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: getResourceColor(totalCPU),
              }}
            >
              {totalCPU.toFixed(1)}%
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--color-border-light)',
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(totalCPU, 100)}%`,
                  height: '100%',
                  backgroundColor: getResourceColor(totalCPU),
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Total Memory
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: getResourceColor(totalMemory, 2000),
              }}
            >
              {totalMemory.toFixed(0)} MB
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--color-border-light)',
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min((totalMemory / 2000) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: getResourceColor(totalMemory, 2000),
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Futile Attempts
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'var(--color-accent-primary)',
              }}
            >
              {totalKills}
            </div>
          </div>
        </div>

        {/* Multiply Message */}
        {showMultiplyMessage && (
          <div
            style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'rgba(92, 107, 192, 0.1)',
              border: '1px solid rgba(92, 107, 192, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--color-accent-primary)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-md)',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            ⚡ The processes grow stronger through adversity
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={() => handleSort('cpu')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '11px',
              backgroundColor:
                sortField === 'cpu'
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-bg-secondary)',
              color:
                sortField === 'cpu'
                  ? 'white'
                  : 'var(--color-text-primary)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Sort by CPU
          </button>
          <button
            onClick={() => handleSort('memory')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '11px',
              backgroundColor:
                sortField === 'memory'
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-bg-secondary)',
              color:
                sortField === 'memory'
                  ? 'white'
                  : 'var(--color-text-primary)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Sort by Memory
          </button>
          <button
            onClick={() => handleSort('name')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '11px',
              backgroundColor:
                sortField === 'name'
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-bg-secondary)',
              color:
                sortField === 'name'
                  ? 'white'
                  : 'var(--color-text-primary)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Sort by Name
          </button>
          <button
            onClick={killAllProcesses}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '11px',
              backgroundColor: 'rgba(220, 53, 69, 0.8)',
              color: 'white',
              border: '1px solid var(--color-accent-secondary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              marginLeft: 'auto',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-secondary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.8)';
            }}
          >
            End All Tasks
          </button>
        </div>
      </div>

      {/* Process Table */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                position: 'sticky',
                top: 0,
                borderBottom: '2px solid var(--color-border-light)',
                zIndex: 1,
              }}
            >
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                Process Name
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                CPU %
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                Memory (MB)
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr
                key={process.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? 'var(--color-bg-secondary)'
                      : 'var(--color-bg-primary)',
                  borderBottom: '1px solid var(--color-border-light)',
                  transition: 'all 0.3s ease',
                  opacity: process.isRespawning ? 0.5 : 1,
                  animation: process.isRespawning
                    ? 'none'
                    : 'fadeIn 0.5s ease-in-out',
                }}
              >
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)',
                    fontWeight: '500',
                  }}
                >
                  <span style={{ marginRight: 'var(--spacing-xs)' }}>
                    {process.icon}
                  </span>
                  {process.name}
                  {process.killCount > 0 && (
                    <span
                      style={{
                        marginLeft: 'var(--spacing-xs)',
                        fontSize: '10px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      ({process.killCount} kills)
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: getResourceColor(process.cpu),
                    backgroundColor: getResourceBgColor(process.cpu),
                    animation:
                      process.cpu > 70 ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                >
                  {process.cpu.toFixed(1)}%
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: getResourceColor(process.memory, 500),
                    backgroundColor: getResourceBgColor(process.memory, 500),
                  }}
                >
                  {process.memory.toFixed(0)}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    fontSize: '11px',
                    color:
                      process.status === 'Respawning...'
                        ? '#f39c12'
                        : '#5cb85c',
                    fontWeight: '500',
                  }}
                >
                  {process.status}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={() => handleKillProcess(process.id, process.killCount)}
                    disabled={process.isRespawning}
                    style={{
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: process.isRespawning
                        ? 'var(--color-border-light)'
                        : 'var(--color-accent-secondary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: process.isRespawning ? 'not-allowed' : 'pointer',
                      transition: 'all var(--transition-fast)',
                      opacity: process.isRespawning ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!process.isRespawning) {
                        e.target.style.backgroundColor = '#c9302c';
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!process.isRespawning) {
                        e.target.style.backgroundColor =
                          'var(--color-accent-secondary)';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    End Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 'var(--spacing-sm)',
          borderTop: '1px solid var(--color-border-light)',
          backgroundColor: 'var(--color-bg-primary)',
          fontSize: '10px',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
        }}
      >
        {processes.length} process{processes.length !== 1 ? 'es' : ''} running
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskManager;
