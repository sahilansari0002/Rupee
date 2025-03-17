import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Download, Share2, HelpCircle, LogOut, Edit, Linkedin, Instagram } from 'lucide-react';

import Header from '../components/Header';
import Toast from '../components/Toast';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatters';
import { exportExpensesToExcel } from '../utils/exportData';

const Profile: React.FC = () => {
  const { expenses, savingsGoals, budgets, billReminders, userProfile, updateUserProfile, notifications, toggleNotifications } = useExpenseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(userProfile.name);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate total savings
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  
  // Calculate net worth
  const netWorth = totalSavings - totalExpenses;
  
  const handleExportData = () => {
    const fileName = exportExpensesToExcel(expenses, budgets, savingsGoals, billReminders);
    setToast({
      show: true,
      message: `Your data has been exported to ${fileName}`,
      type: 'success'
    });
  };
  
  const handleSaveUserName = () => {
    updateUserProfile({ name: userName });
    setIsEditing(false);
    setToast({
      show: true,
      message: 'Profile name updated successfully',
      type: 'success'
    });
  };
  
  const handleShareApp = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setToast({
          show: true,
          message: `Link copied! Share RupeeTrack with ${userProfile.name}'s friends`,
          type: 'success'
        });
      })
      .catch(() => {
        setToast({
          show: true,
          message: 'Failed to copy link',
          type: 'error'
        });
      });
  };
  
  const menuItems = [
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your data and privacy settings',
      action: () => {},
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download your expense history',
      action: handleExportData,
    },
    {
      icon: Share2,
      title: 'Share App',
      description: 'Invite friends to use RupeeTrack',
      action: handleShareApp,
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help with using the app',
      action: () => {},
    },
    {
      icon: LogOut,
      title: 'Log Out',
      description: 'Sign out from your account',
      danger: true,
      action: () => {},
    },
  ];
  
  return (
    <div className="pb-20">
      <Header title="Profile" showBack={true} />
      
      <Toast 
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full mr-4">
              <User size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            
            {isEditing ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input mb-2"
                  placeholder="Enter your name"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="btn-secondary text-xs py-1 px-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveUserName} 
                    className="btn-primary text-xs py-1 px-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit size={14} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Using local storage mode
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-lg font-semibold text-danger-600 dark:text-danger-500">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Savings</p>
              <p className="text-lg font-semibold text-success-600 dark:text-success-500">
                {formatCurrency(totalSavings)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Net Worth</p>
              <p className={`text-lg font-semibold ${
                netWorth >= 0 
                  ? 'text-success-600 dark:text-success-500' 
                  : 'text-danger-600 dark:text-danger-500'
              }`}>
                {formatCurrency(netWorth)}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Enable Notifications</span>
            </div>
            
            <button
              onClick={toggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {notifications && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Upcoming Bill Reminders</h3>
              {billReminders.filter(bill => !bill.isPaid).length > 0 ? (
                billReminders.filter(bill => !bill.isPaid).slice(0, 2).map(bill => (
                  <div key={bill.id} className="text-xs p-2 mb-2 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{bill.name}</span>
                      <span className="text-danger-600 dark:text-danger-400">{formatCurrency(bill.amount)}</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 mt-1">
                      Due on {new Date(bill.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No upcoming bills</p>
              )}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="card"
        >
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className={`p-2 rounded-full ${
                  item.danger 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : 'bg-gray-100 dark:bg-gray-800'
                } mr-3`}>
                  <item.icon size={18} className={
                    item.danger 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  } />
                </div>
                
                <div className="flex-1 text-left">
                  <p className={`font-medium ${
                    item.danger ? 'text-red-600 dark:text-red-400' : ''
                  }`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              RupeeTrack v0.1.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Sahil Ali Creations
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <a 
                href="https://www.linkedin.com/in/sahilansari0002/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://www.instagram.com/sahilansari0002/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;