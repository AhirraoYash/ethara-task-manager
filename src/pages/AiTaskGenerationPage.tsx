import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Project, User } from '../types';
import { Wand2, ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { getProjects } from '../api/project.api';
import { getUsers } from '../api/user.api';
import { createTask, generateAITasks } from '../api/task.api';

interface GeneratedTask {
  _id: string; // temporary id
  title: string;
  description: string;
  assignedTo: string;
}

export default function AiTaskGenerationPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [prompt, setPrompt] = useState('');
  const [taskCount, setTaskCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [projectsData, usersData] = await Promise.all([
        getProjects(),
        getUsers()
      ]);
      
      setProjects(projectsData || []);
      setMembers((usersData || []).filter((u: User) => u.role === 'Member'));
      
      if (projectsData && projectsData.length > 0) {
        setSelectedProjectId(projectsData[0]._id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load initial data.');
    }
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      setError('Please select a project first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt for the AI.');
      return;
    }
    if (members.length === 0) {
      setError('No members available to assign tasks to.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      // Pick a random member for assignment, or the first one as default
      const defaultMemberId = members[0]._id;
      
      const response = await generateAITasks(
        prompt + (taskCount ? ` Please generate exactly ${taskCount} tasks.` : ''),
        selectedProjectId,
        defaultMemberId,
        true // preview mode
      );

      const newTasks = response.tasks.map((task: any, index: number) => ({
        _id: Math.random().toString(36).substring(7),
        title: task.title,
        description: task.description || '',
        assignedTo: members[index % members.length]._id
      }));

      setGeneratedTasks(newTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to generate tasks using AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskChange = (taskId: string, field: keyof GeneratedTask, value: string) => {
    setGeneratedTasks(prev => 
      prev.map(t => t._id === taskId ? { ...t, [field]: value } : t)
    );
  };

  const handleRemoveTask = (taskId: string) => {
    setGeneratedTasks(prev => prev.filter(t => t._id !== taskId));
  };

  const handleSaveTasks = async () => {
    if (generatedTasks.length === 0) return;
    
    // Validate
    if (generatedTasks.some(t => !t.title.trim() || !t.assignedTo)) {
      setError('Please ensure all generated tasks have a title and assigned member.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Bulk create by calling API for each task
      await Promise.all(generatedTasks.map(task => 
        createTask({
          title: task.title,
          description: task.description,
          project: selectedProjectId,
          assignedTo: task.assignedTo
        })
      ));

      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to save generated tasks.');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/admin')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            AI Task Assignment <Wand2 size={24} className="ml-2 text-indigo-600" />
          </h1>
          <p className="text-gray-500 text-sm mt-1">Generate and distribute tasks automatically using AI.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Project</label>
              <select
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="" disabled>Select a project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id} className="text-gray-900">{p.title}</option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Count</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
                value={taskCount}
                onChange={(e) => setTaskCount(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="lg:col-span-2 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Prompt</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Needs 5 data labeling tasks for the new medical dataset..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || members.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin mr-2" /> : <Wand2 size={18} className="mr-2" />}
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        {generatedTasks.length > 0 && (
          <div className="p-6">
            <div className="flex items-center justify-between xl mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Tasks</h3>
              <button
                onClick={handleSaveTasks}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center disabled:opacity-50 text-sm"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                Save and Dispatch Tasks
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Task Title</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Description</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Assignee</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border-transparent hover:border-gray-300 focus:border-indigo-500 rounded bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={task.title}
                          onChange={(e) => handleTaskChange(task._id, 'title', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border-transparent hover:border-gray-300 focus:border-indigo-500 rounded bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={task.description}
                          onChange={(e) => handleTaskChange(task._id, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          className="w-full px-2 py-1 text-sm text-gray-900 border-transparent hover:border-gray-300 focus:border-indigo-500 rounded bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={task.assignedTo}
                          onChange={(e) => handleTaskChange(task._id, 'assignedTo', e.target.value)}
                        >
                          <option value="" disabled>Select Assignee</option>
                          {members.map(m => (
                            <option key={m._id} value={m._id} className="text-gray-900">{m.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 tracking-wider text-right whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveTask(task._id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {!isGenerating && generatedTasks.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Wand2 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm">Enter a prompt and hit Generate to see AI proposed tasks here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
