/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import AiTaskGenerationPage from './pages/AiTaskGenerationPage';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';

function PrivateRoute({ children, role }: { children: React.ReactNode; role: 'Admin' | 'Member' }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/" />;
  if (user.role !== role) {
    if (user.role === 'Admin') return <Navigate to="/admin" />;
    return <Navigate to="/member" />;
  }
  return children;
}

export default function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {user && user.role === 'Admin' && <Navbar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="Admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/ai-tasks"
              element={
                <PrivateRoute role="Admin">
                  <AiTaskGenerationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/member"
              element={
                <PrivateRoute role="Member">
                  <MemberDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
