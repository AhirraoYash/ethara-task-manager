import { useState, useEffect } from 'react';
import { Plus, Users, Layout, CheckSquare, ListTodo, History, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import AddMemberModal from '../components/AddMemberModal';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateProjectModal from '../components/CreateProjectModal';
import AiTaskGenerator from '../components/AiTaskGenerator';
import { User, Project, Task } from '../types';
import { getUsers } from '../api/user.api';
import { getProjects } from '../api/project.api';
import { getTasks } from '../api/task.api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isAiTaskGeneratorOpen, setAiTaskGeneratorOpen] = useState(false);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [uData, pData, tData] = await Promise.all([
        getUsers(),
        getProjects(),
        getTasks()
      ]);
      
      setUsers(uData);
      setProjects(pData);
      setTasks(tData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage projects, tasks, and users.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setMemberModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Users size={16} className="mr-2" /> Add Member
          </button>
          <button 
            onClick={() => setProjectModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Layout size={16} className="mr-2" /> New Project
          </button>
          <button 
            onClick={() => setTaskModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-900 border border-transparent text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus size={16} className="mr-2" /> New Task
          </button>
          <button 
            onClick={() => setAiTaskGeneratorOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Wand2 size={16} className="mr-2" /> Auto-Assign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-blue-600 mb-2">
            <Layout size={20} className="mr-2" />
            <h3 className="font-semibold text-gray-900">Total Projects</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <CheckSquare size={20} className="mr-2" />
            <h3 className="font-semibold text-gray-900">Total Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-purple-600 mb-2">
            <Users size={20} className="mr-2" />
            <h3 className="font-semibold text-gray-900">Team Members</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'Member').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-2 space-y-4 sm:space-y-0">
            <h2 className="text-lg font-bold text-gray-900 border-none pb-0">All Tasks</h2>
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-1 flex items-center text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'active' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ListTodo size={16} className="mr-2" />
                Active
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {pendingTasks.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-1 flex items-center text-sm font-medium transition-colors border-b-2 ${
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
          </div>
          
          {activeTab === 'active' ? (
            pendingTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No active tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    assignedUserName={users.find(u => u._id === task.assignedTo)?.name}
                    projectName={projects.find(p => p._id === task.project)?.title}
                  />
                ))}
              </div>
            )
          ) : (
            completedTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                <History className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No completed tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Completed tasks will show up here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-80">
                {completedTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    assignedUserName={users.find(u => u._id === task.assignedTo)?.name}
                    projectName={projects.find(p => p._id === task.project)?.title}
                  />
                ))}
              </div>
            )
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Team Directory</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
            {users.map(user => (
              <div key={user._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.mobile}{user.email ? ` • ${user.email}` : ''}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddMemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setMemberModalOpen(false)} 
        onSuccess={fetchData} 
      />
      
      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setTaskModalOpen(false)} 
        onSuccess={fetchData}
        users={users}
        projects={projects}
      />
      
      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setProjectModalOpen(false)} 
        onSuccess={fetchData} 
      />

      <AiTaskGenerator
        isOpen={isAiTaskGeneratorOpen}
        onClose={() => setAiTaskGeneratorOpen(false)}
        onSuccess={fetchData}
        projects={projects}
        users={users}
      />
    </div>
  );
}
