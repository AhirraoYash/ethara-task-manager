import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">AI Project Dash</span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
          <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full mt-1">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
