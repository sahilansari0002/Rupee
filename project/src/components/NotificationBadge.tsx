import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatters';

interface NotificationBadgeProps {
  onClick?: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onClick }) => {
  const { billReminders, notifications } = useExpenseStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [animateNotification, setAnimateNotification] = useState(false);
  
  const upcomingBills = billReminders.filter(bill => !bill.isPaid);
  const hasNotifications = upcomingBills.length > 0 && notifications;
  
  useEffect(() => {
    // Animate notification bell periodically
    if (hasNotifications) {
      const interval = setInterval(() => {
        setAnimateNotification(true);
        setTimeout(() => setAnimateNotification(false), 1000);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [hasNotifications]);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowDropdown(!showDropdown);
    }
  };
  
  return (
    <div className="relative">
      <button 
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
        onClick={handleClick}
      >
        <motion.div
          animate={animateNotification ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Bell size={20} />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
          )}
        </motion.div>
      </button>
      
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium">Notifications</h3>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {hasNotifications ? (
                upcomingBills.slice(0, 5).map(bill => (
                  <div 
                    key={bill.id} 
                    className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{bill.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due on {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-danger-600 dark:text-danger-400 font-medium">
                        {formatCurrency(bill.amount)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No new notifications
                </div>
              )}
            </div>
            
            {hasNotifications && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 text-center">
                <button 
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium"
                  onClick={() => setShowDropdown(false)}
                >
                  View All
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBadge;