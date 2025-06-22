import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, MessageCircle } from 'lucide-react';
import { getNotifications } from '../utils/storage';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user) return <>{children}</>;

  const notifications = getNotifications().filter(n => n.userId === user.id && !n.isRead);
  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">EMS</h1>
              </div>
              <div className="ml-4">
                <h2 className="text-sm text-gray-600">
                  {user.type === 'admin' ? 'Admin Dashboard' : 'Employee Portal'}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-gray-500" />
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;