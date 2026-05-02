import React, { useState } from 'react';
import { Project, User } from '../types';
import { generateAITasks } from '../api/task.api';
import { X, Wand2, Loader2 } from 'lucide-react';

interface AiTaskGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projects: Project[];
  users: User[];
}

export default function AiTaskGenerator({
  isOpen,
  onClose,
  onSuccess,
  projects,
  users,
}: AiTaskGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [project, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !project || !assignedTo) {
      setError('Please fill in all fields (Prompt, Project, Assignee).');
      return;
    }

    setError('');
    setSuccessMsg('');
    setIsGenerating(true);

    try {
      await generateAITasks(prompt, project, assignedTo);
      setSuccessMsg('Tasks successfully generated!');
      setPrompt('');
      setProjectId('');
      setAssignedTo('');
      
      // Clear success message and trigger parent refresh after a short delay
      setTimeout(() => {
        setSuccessMsg('');
        onSuccess();
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate tasks using AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const members = users.filter((u) => u.role === 'Member');

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex flex-col items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <Wand2 size={20} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Task Generator</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="px-6 py-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg">
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Project
              </label>
              <select
                value={project}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                disabled={isGenerating}
              >
                <option value="" disabled>Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                disabled={isGenerating}
              >
                <option value="" disabled>Select a member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Create 3 tasks for evaluating medical data..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Gemini is generating tasks...
                </>
              ) : (
                <>
                  <Wand2 size={18} className="mr-2" />
                  ✨ Generate with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
