import React from 'react';
import { motion } from 'framer-motion';
import { Expense } from '../store/expenseStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryById, getPaymentMethodById } from '../utils/categories';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const category = getCategoryById(expense.category);
  const paymentMethod = getPaymentMethodById(expense.paymentMethod);
  const Icon = category.icon;
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="card mb-3 cursor-pointer"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${category.color} bg-opacity-10 mr-4`}>
          <Icon size={20} className={category.color} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{expense.description}</h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatDate(expense.date, true)}</span>
            <span className="mx-1">•</span>
            <span>{paymentMethod.name}</span>
            {expense.isRecurring && (
              <>
                <span className="mx-1">•</span>
                <span className="badge-primary">Recurring</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-danger-600 dark:text-danger-500">
            {formatCurrency(expense.amount)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {category.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;