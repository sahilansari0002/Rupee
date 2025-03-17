import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, TrendingUp, AlertTriangle } from 'lucide-react';

import Header from '../components/Header';
import ExpenseChart from '../components/ExpenseChart';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatters';
import { predictExpenseForNextMonth, identifyAnomalies } from '../utils/predictions';
import { getCategoryById } from '../utils/categories';

const Analytics: React.FC = () => {
  const { expenses, getTotalExpensesByCategory } = useExpenseStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  
  // Get category totals
  const categoryTotals = getTotalExpensesByCategory();
  
  // Sort categories by amount
  const sortedCategories = Object.entries(categoryTotals)
    .map(([categoryId, amount]) => ({
      id: categoryId,
      amount,
      ...getCategoryById(categoryId),
    }))
    .sort((a, b) => b.amount - a.amount);
  
  // Calculate total expenses
  const totalExpenses = sortedCategories.reduce((sum, category) => sum + category.amount, 0);
  
  // Get predicted expenses for next month
  const predictedTotal = predictExpenseForNextMonth(expenses);
  
  // Get spending anomalies
  const anomalies = identifyAnomalies(expenses);
  
  return (
    <div className="pb-20">
      <Header title="Analytics" showBack={true} />
      
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Expense Breakdown</h2>
            
            <div className="flex space-x-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as any)}
                className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1"
              >
                <option value="pie">Pie</option>
                <option value="bar">Bar</option>
              </select>
            </div>
          </div>
          
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertTriangle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No expense data available
              </p>
            </div>
          ) : (
            <ExpenseChart type={chartType} period={period} />
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          
          {sortedCategories.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCategories.slice(0, 5).map((category) => {
                const percentage = (category.amount / totalExpenses) * 100;
                
                return (
                  <div key={category.id}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <category.icon size={16} className={category.color} />
                        <span className="ml-2 text-sm">{category.name}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(category.amount)}
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-2 rounded-full ${category.color.replace('text-', 'bg-')}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Predictions</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Predicted Next Month
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(predictedTotal)}
                </p>
              </div>
              
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                <TrendingUp size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            {totalExpenses > 0 && (
              <div className="mt-2 text-sm">
                <span className={predictedTotal > totalExpenses ? 'text-danger-500' : 'text-success-500'}>
                  {predictedTotal > totalExpenses 
                    ? `↑ ${Math.round((predictedTotal / totalExpenses - 1) * 100)}% increase` 
                    : `↓ ${Math.round((1 - predictedTotal / totalExpenses) * 100)}% decrease`}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  compared to current month
                </span>
              </div>
            )}
          </div>
          
          {anomalies.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Unusual Spending</h3>
              
              {anomalies.slice(0, 3).map((anomaly) => {
                const category = getCategoryById(anomaly.category);
                
                return (
                  <div key={anomaly.id} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <category.icon size={16} className="text-red-500" />
                        <span className="ml-2 text-sm font-medium">{anomaly.description}</span>
                      </div>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(anomaly.amount)}
                      </span>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Unusually high spending in {category.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;