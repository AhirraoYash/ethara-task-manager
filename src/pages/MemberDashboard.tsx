import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import TaskCard from '../components/TaskCard';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { Project, Task } from '../types';
import { CheckSquare, ListTodo, History, Sparkles, LogOut, KeyRound } from 'lucide-react';
import { getTasks, updateTaskStatus } from '../api/task.api';
import { getProjects } from '../api/project.api';
import { useNavigate } from 'react-router-dom';

export default function MemberDashboard() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [tData, pData] = await Promise.all([
        getTasks(user._id),
        getProjects()
      ]);
      setTasks(tData);
      setProjects(pData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus as Task['status']);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus as Task['status'] } : t));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      
      {/* Animated background blobs */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(139,92,246,0.4)'
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>ETHARA</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>Member Portal</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', margin: 0 }}>{user?.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{user?.email}</p>
              </div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, color: 'white'
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={() => setPasswordModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px',
                  background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  color: '#c4b5fd', fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.12)'; }}
              >
                <KeyRound size={15} /> Change Password
              </button>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
          
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '20px', padding: '32px', marginBottom: '32px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <p style={{ color: 'rgba(167,139,250,0.9)', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Welcome back 👋</p>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', margin: '0 0 4px 0' }}>{user?.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              {pendingTasks.length > 0 ? `You have ${pendingTasks.length} active task${pendingTasks.length !== 1 ? 's' : ''} waiting.` : 'All caught up! Great work today ✨'}
            </p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Tasks', value: tasks.length, icon: '📋', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
              { label: 'In Progress', value: inProgressCount, icon: '⚡', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
              { label: 'Completed', value: completedTasks.length, icon: '✅', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 4px 24px ${stat.glow}`,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '20px', marginBottom: '32px', backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Overall Progress</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>{completionRate}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${completionRate}%`, borderRadius: '99px',
                  background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #10b981)',
                  transition: 'width 1s ease', boxShadow: '0 0 12px rgba(139,92,246,0.6)'
                }} />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '24px',
            background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '6px',
            border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content'
          }}>
            {[
              { key: 'active', label: 'Active', count: pendingTasks.length, icon: <ListTodo size={15} /> },
              { key: 'completed', label: 'Completed', count: completedTasks.length, icon: <History size={15} /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  background: activeTab === tab.key
                    ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                    : 'transparent',
                  color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.4)',
                  boxShadow: activeTab === tab.key ? '0 4px 15px rgba(139,92,246,0.4)' : 'none',
                }}
              >
                {tab.icon}
                {tab.label}
                <span style={{
                  padding: '1px 7px', borderRadius: '99px', fontSize: '11px',
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.4)'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Task Grid */}
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid #8b5cf6',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : activeTab === 'active' ? (
            pendingTasks.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '20px',
                border: '1px dashed rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <CheckSquare style={{ margin: '0 auto 12px', color: 'rgba(255,255,255,0.2)' }} size={36} />
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>You're all caught up!</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>No active tasks. Enjoy your day ☀️</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {pendingTasks.map(task => (
                  <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange}
                    projectName={projects.find(p => p._id === task.project)?.title} />
                ))}
              </div>
            )
          ) : (
            completedTasks.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '20px',
                border: '1px dashed rgba(255,255,255,0.1)'
              }}>
                <History style={{ margin: '0 auto 12px', color: 'rgba(255,255,255,0.2)' }} size={36} />
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>No completed tasks yet</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Complete tasks to see them here.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', opacity: 0.85 }}>
                {completedTasks.map(task => (
                  <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange}
                    projectName={projects.find(p => p._id === task.project)?.title} />
                ))}
              </div>
            )
          )}
        </main>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        userMobile={user?.mobile}
      />
    </div>
  );
}

