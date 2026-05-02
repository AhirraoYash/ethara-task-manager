import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Clock, CheckCircle, CircleDashed } from 'lucide-react';
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
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onStatusChange) return;
    setIsUpdating(true);
    await onStatusChange(task.id, e.target.value);
    setIsUpdating(false);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'Completed': return <CheckCircle className="text-green-500" size={18} />;
      case 'In Progress': return <CircleDashed className="text-blue-500" size={18} />;
      default: return <Clock className="text-gray-400" size={18} />;
    }
  };

  const getStatusBadgeClass = () => {
    switch (task.status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 leading-tight">{task.title}</h4>
        {!isAdmin && (
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusBadgeClass()}`}>
            {getStatusIcon()}
            <span>{task.status}</span>
          </div>
        )}
        {isAdmin && (
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusBadgeClass()}`}>
             <span>{task.status}</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 font-medium">
          {projectName && <span className="block mb-1">Project: {projectName}</span>}
          {isAdmin && assignedUserName && <span>Assigned to: <span className="text-gray-900">{assignedUserName}</span></span>}
        </div>
        
        {!isAdmin && onStatusChange && (
          <div className="flex items-center">
            <label htmlFor={`status-${task.id}`} className="sr-only">Update Status</label>
            <select
              id={`status-${task.id}`}
              disabled={isUpdating}
              value={task.status}
              onChange={handleStatusChange}
              className="text-sm border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
