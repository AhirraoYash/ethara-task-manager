import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import TaskCard from '../components/TaskCard';
import { Project, Task } from '../types';
import { CheckSquare, ListTodo, History } from 'lucide-react';
import { getTasks, updateTaskStatus } from '../api/task.api';
import { getProjects } from '../api/project.api';

export default function MemberDashboard() {
  const user = useAuthStore(state => state.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [tData, pData] = await Promise.all([
        getTasks(user.id),
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

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus as Task['status']);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 mt-1">Manage your assigned tasks and update your progress.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-6 space-x-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center ${
            activeTab === 'active' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ListTodo size={16} className="mr-2" />
          Active Tasks
          <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            {pendingTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center ${
            activeTab === 'completed' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <History size={16} className="mr-2" />
          Completed
          <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            {completedTasks.length}
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'active' ? (
        pendingTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed shadow-sm">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No active tasks</h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up! Enjoy your day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={handleStatusChange}
                projectName={projects.find(p => p.id === task.projectId)?.title}
              />
            ))}
          </div>
        )
      ) : (
        completedTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed shadow-sm">
            <History className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No completed tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Your completed tasks will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
            {completedTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={handleStatusChange}
                projectName={projects.find(p => p.id === task.projectId)?.title}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
