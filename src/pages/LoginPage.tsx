import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api/auth.api';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/member');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser(identifier.trim(), password);
      login(data.user, data.token);
      if (data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      {/* Left Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-sm">
               <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="identifier">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="identifier"
                    type="email"
                    required
                    className="pl-10 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm"
                    placeholder="Enter your email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="pl-10 pr-10 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2.5">
                  *Members: Use your mobile number as password on initial login.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8">
             <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-200 shadow-sm flex items-center justify-between">
               <div>
                  <p className="font-semibold text-gray-800 mb-0.5">Demo Admin</p>
                  <p className="text-xs">admin@gmail.com</p>
               </div>
               <button 
                type="button"
                onClick={() => {
                  setIdentifier('admin@gmail.com');
                  setPassword('password');
                }}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-xs text-gray-700 transition-colors"
               >
                 Auto-fill Admin
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Right Brand Section */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center relative overflow-hidden border-l border-gray-200">
        <div className="absolute inset-0 bg-blue-50/50"></div>
        <div className="absolute w-[800px] h-[800px] bg-blue-100 rounded-full blur-3xl opacity-50 -top-48 -right-48 pointer-events-none"></div>
        <div className="absolute w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 -bottom-32 -left-32 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-blue-600 font-bold text-2xl">A</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">AI Project Dash</h2>
          <p className="text-gray-600 leading-relaxed">
            Manage your AI annotation projects with precision. Streamline workflows, track member progress, and complete tasks faster.
          </p>
        </div>
      </div>
    </div>
  );
}
