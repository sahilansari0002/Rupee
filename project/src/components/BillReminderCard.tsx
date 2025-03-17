import React from 'react';
import { motion } from 'framer-motion';
import { BillReminder } from '../store/expenseStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryById } from '../utils/categories';
import { useExpenseStore } from '../store/expenseStore';
import { Calendar, Check } from 'lucide-react';

interface BillReminderCardProps {
  reminder: BillReminder;
}

const BillReminderCard: React.FC<BillReminderCardProps> = ({ reminder }) => {
  const category = getCategoryById(reminder.category);
  const Icon = category.icon;
  const { markBillAsPaid } = useExpenseStore();
  
  // Calculate days remaining
  const daysRemaining = () => {
    const today = new Date();
    const dueDate = new Date(reminder.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const days = daysRemaining();
  
  // Determine urgency
  const getUrgencyColor = () => {
    if (days < 0) return 'text-danger-600 dark:text-danger-500';
    if (days < 3) return 'text-warning-600 dark:text-warning-500';
    return 'text-success-600 dark:text-success-500';
  };
  
  const getUrgencyText = () => {
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };
  
  const handleMarkAsPaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    markBillAsPaid(reminder.id);
  };
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="card mb-3"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${category.color} bg-opacity-10 mr-4`}>
          <Icon size={20} className={category.color} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{reminder.name}</h3>
          <div className="flex items-center text-xs mt-1">
            <Calendar size={12} className="mr-1 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">{formatDate(reminder.dueDate, true)}</span>
            {reminder.isRecurring && (
              <span className="ml-2 badge-primary">Recurring</span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold">
            {formatCurrency(reminder.amount)}
          </p>
          <p className={`text-xs mt-1 ${getUrgencyColor()}`}>
            {getUrgencyText()}
          </p>
        </div>
      </div>
      
      {!reminder.isPaid && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleMarkAsPaid}
            className="btn-success flex items-center text-xs py-1.5"
          >
            <Check size={14} className="mr-1" />
            Mark as Paid
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BillReminderCard;