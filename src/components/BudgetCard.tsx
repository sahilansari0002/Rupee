import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Budget } from '../store/expenseStore';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { getCategoryById } from '../utils/categories';
import { useExpenseStore } from '../store/expenseStore';
import { ArrowUp, ArrowDown, Sliders } from 'lucide-react';

interface BudgetCardProps {
  budget: Budget;
  onPress?: () => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onPress }) => {
  const category = getCategoryById(budget.category);
  const Icon = category.icon;
  const { getBudgetStatus, updateBudget } = useExpenseStore();
  const { used, remaining, percentage } = getBudgetStatus(budget.id);
  const [showAdjustment, setShowAdjustment] = useState(false);
  
  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentage < 50) return 'bg-success-500';
    if (percentage < 80) return 'bg-warning-500';
    return 'bg-danger-500';
  };
  
  // Handle manual budget adjustment
  const handleAdjustBudget = (direction: 'up' | 'down') => {
    const adjustmentAmount = budget.amount * 0.1; // 10% adjustment
    const newAmount = direction === 'up' 
      ? budget.amount + adjustmentAmount 
      : Math.max(used, budget.amount - adjustmentAmount);
    
    updateBudget(budget.id, { amount: Math.round(newAmount) });
    setShowAdjustment(false);
  };
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (onPress) onPress();
        else setShowAdjustment(!showAdjustment);
      }}
      className="card mb-3 cursor-pointer"
    >
      <div className="flex items-center mb-3">
        <div className={`p-3 rounded-full ${category.color} bg-opacity-10 mr-4`}>
          <Icon size={20} className={category.color} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
          </p>
        </div>
        
        <div className="text-right">
          <p className="font-semibold">
            {formatCurrency(budget.amount)}
          </p>
          {budget.isAutomaticAdjustment && (
            <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 mt-1">
              <Sliders size={10} className="mr-1" />
              <span>Dynamic</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-2.5 rounded-full ${getProgressColor()}`}
        />
      </div>
      
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          Used: {formatCurrency(used)} ({formatPercentage(percentage)})
        </span>
        <span className="font-medium">
          Remaining: {formatCurrency(remaining)}
        </span>
      </div>
      
      {showAdjustment && !budget.isAutomaticAdjustment && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex justify-end space-x-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdjustBudget('down');
            }}
            className="btn-secondary flex items-center text-xs py-1.5"
            disabled={percentage >= 100}
          >
            <ArrowDown size={14} className="mr-1" />
            Decrease
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdjustBudget('up');
            }}
            className="btn-primary flex items-center text-xs py-1.5"
          >
            <ArrowUp size={14} className="mr-1" />
            Increase
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BudgetCard;