import React from 'react';
import { motion } from 'framer-motion';
import { Income } from '../store/expenseStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DollarSign, Repeat } from 'lucide-react';

interface IncomeCardProps {
  income: Income;
  onPress?: () => void;
}

const IncomeCard: React.FC<IncomeCardProps> = ({ income, onPress }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="card mb-3 cursor-pointer"
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-success-100 dark:bg-success-900 mr-4">
          <DollarSign size={20} className="text-success-600 dark:text-success-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{income.source}</h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatDate(income.date, true)}</span>
            {income.isRecurring && (
              <>
                <span className="mx-1">•</span>
                <span className="flex items-center">
                  <Repeat size={12} className="mr-1" />
                  {income.recurringPeriod?.charAt(0).toUpperCase() + income.recurringPeriod?.slice(1)}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-success-600 dark:text-success-500">
            {formatCurrency(income.amount)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {income.description || 'Income'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default IncomeCard;