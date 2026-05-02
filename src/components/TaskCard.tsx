import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, Loader2, Clock3, FolderOpen, Zap } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  assignedUserName?: string;
  projectName?: string;
}

export default function TaskCard({ task, onStatusChange, assignedUserName, projectName }: TaskCardProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';
  const isMember = !isAdmin;
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onStatusChange) return;
    setIsUpdating(true);
    await onStatusChange(task._id, e.target.value);
    setIsUpdating(false);
  };

  const statusConfig = {
    'Completed': { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', color: '#059669', icon: <CheckCircle2 size={13} />, label: 'Completed' },
    'In Progress': { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', color: '#2563eb', icon: <Zap size={13} />, label: 'In Progress' },
    'Pending': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', color: '#d97706', icon: <Clock3 size={13} />, label: 'Pending' },
  };

  const cfg = statusConfig[task.status] || statusConfig['Pending'];

  // Admin → clean white card on light bg; Member → dark glassmorphism on dark bg
  const cardStyle = isAdmin ? {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  } : {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '18px',
    padding: '20px',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.25s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const titleColor = isAdmin ? '#111827' : 'white';
  const descColor = isAdmin ? '#6b7280' : 'rgba(255,255,255,0.45)';
  const dividerColor = isAdmin ? '#f3f4f6' : 'rgba(255,255,255,0.07)';
  const assignedColor = isAdmin ? '#6b7280' : 'rgba(255,255,255,0.35)';

  return (
    <div
      style={cardStyle}
      onMouseEnter={e => {
        if (isAdmin) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        } else {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(139,92,246,0.35)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        if (isAdmin) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          (e.currentTarget as HTMLDivElement).style.border = '1px solid #e5e7eb';
        } else {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.09)';
        }
      }}
    >
      {/* Top status accent line (member only) */}
      {isMember && (
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
          background: task.status === 'Completed'
            ? 'linear-gradient(90deg, transparent, #34d399, transparent)'
            : task.status === 'In Progress'
            ? 'linear-gradient(90deg, transparent, #60a5fa, transparent)'
            : 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
          opacity: 0.6,
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: titleColor, lineHeight: 1.45, margin: 0, flex: 1, paddingRight: '10px' }}>
          {task.title}
        </h4>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '3px 9px', borderRadius: '99px',
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          color: cfg.color, fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          {cfg.icon}
          {cfg.label}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: '13px', color: descColor, lineHeight: 1.55,
          margin: '0 0 14px 0', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '12px', borderTop: `1px solid ${dividerColor}`
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {projectName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FolderOpen size={11} color={isAdmin ? '#7c3aed' : 'rgba(139,92,246,0.8)'} />
              <span style={{ fontSize: '11px', color: isAdmin ? '#7c3aed' : 'rgba(167,139,250,0.9)', fontWeight: 600 }}>
                {projectName}
              </span>
            </div>
          )}
          {isAdmin && assignedUserName && (
            <span style={{ fontSize: '11px', color: assignedColor }}>
              → {assignedUserName}
            </span>
          )}
        </div>

        {/* Status changer for members only */}
        {!isAdmin && onStatusChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isUpdating && <Loader2 size={13} color="#8b5cf6" style={{ animation: 'spin 0.8s linear infinite' }} />}
            <select
              id={`status-${task._id}`}
              disabled={isUpdating}
              value={task.status}
              onChange={handleStatusChange}
              style={{
                padding: '5px 10px', borderRadius: '9px', fontSize: '12px', fontWeight: 600,
                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)',
                color: '#c4b5fd', cursor: 'pointer', outline: 'none',
                opacity: isUpdating ? 0.5 : 1,
              }}
            >
              <option value="Pending" style={{ background: '#1e1b4b' }}>Pending</option>
              <option value="In Progress" style={{ background: '#1e1b4b' }}>In Progress</option>
              <option value="Completed" style={{ background: '#1e1b4b' }}>Completed</option>
            </select>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
