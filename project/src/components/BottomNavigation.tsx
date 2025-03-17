import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PieChart, Plus, List, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analytics', icon: PieChart, label: 'Analytics' },
    { path: '/add', icon: Plus, label: 'Add' },
    { path: '/expenses', icon: List, label: 'Expenses' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 w-12 h-1 bg-primary-600 dark:bg-primary-400 rounded-b-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {item.path === '/add' ? (
                <div className="bg-primary-600 dark:bg-primary-500 rounded-full p-3 -mt-6 shadow-lg">
                  <item.icon size={24} className="text-white" />
                </div>
              ) : (
                <>
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;