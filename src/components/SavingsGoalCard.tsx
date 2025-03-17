import React from 'react';
import { motion } from 'framer-motion';
import { SavingsGoal } from '../store/expenseStore';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Target } from 'lucide-react';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onPress?: () => void;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal, onPress }) => {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  
  // Calculate days remaining if deadline exists
  const getDaysRemaining = () => {
    if (!goal.deadline) return null;
    
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="card mb-3 cursor-pointer"
    >
      <div className="flex items-center mb-3">
        <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mr-4">
          <Target size={20} className="text-primary-600 dark:text-primary-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{goal.name}</h3>
          {daysRemaining !== null && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {daysRemaining > 0 
                ? `${daysRemaining} days remaining` 
                : daysRemaining === 0 
                  ? 'Due today' 
                  : `Overdue by ${Math.abs(daysRemaining)} days`}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="font-semibold">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-2.5 rounded-full bg-primary-600 dark:bg-primary-500"
        />
      </div>
      
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          Saved: {formatCurrency(goal.currentAmount)} ({formatPercentage(percentage)})
        </span>
        <span className="font-medium">
          Remaining: {formatCurrency(remaining)}
        </span>
      </div>
    </motion.div>
  );
};

export default SavingsGoalCard;