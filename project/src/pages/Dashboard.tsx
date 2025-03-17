import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Plus, Calendar, Target, 
  AlertTriangle, ChevronRight, Lightbulb, DollarSign
} from 'lucide-react';

import Header from '../components/Header';
import ExpenseCard from '../components/ExpenseCard';
import IncomeCard from '../components/IncomeCard';
import BudgetCard from '../components/BudgetCard';
import BillReminderCard from '../components/BillReminderCard';
import ExpenseChart from '../components/ExpenseChart';

import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatters';
import { generateSavingsTips } from '../utils/predictions';

const Dashboard: React.FC = () => {
  const { 
    expenses, 
    incomes,
    budgets, 
    billReminders,
    getTotalExpensesForCurrentMonth,
    getTotalIncomeForCurrentMonth,
    getRemainingBudget,
    getUpcomingBills,
    getSavingsTips
  } = useExpenseStore();
  
  const [activeTip, setActiveTip] = useState(0);
  
  const totalExpensesThisMonth = getTotalExpensesForCurrentMonth();
  const totalIncomeThisMonth = getTotalIncomeForCurrentMonth();
  const remainingBudget = getRemainingBudget();
  const recentExpenses = expenses.slice(0, 2);
  const recentIncomes = incomes.slice(0, 1);
  const upcomingBills = getUpcomingBills().slice(0, 2);
  const activeBudgets = budgets.slice(0, 2);
  
  // Get savings tips
  const savingsTips = getSavingsTips();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="pb-20">
      <Header 
        title="Dashboard" 
        showProfile={true} 
        showNotification={true} 
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4"
      >
        {/* Monthly Overview */}
        <motion.div variants={itemVariants} className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
              <p className="text-xl font-bold text-success-600 dark:text-success-500">
                {formatCurrency(totalIncomeThisMonth)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
              <p className="text-xl font-bold text-danger-600 dark:text-danger-500">
                {formatCurrency(totalExpensesThisMonth)}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Remaining</p>
              <p className={`text-lg font-bold ${
                remainingBudget >= 0 
                  ? 'text-success-600 dark:text-success-500' 
                  : 'text-danger-600 dark:text-danger-500'
              }`}>
                {formatCurrency(remainingBudget)}
              </p>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalIncomeThisMonth > 0 ? (totalExpensesThisMonth / totalIncomeThisMonth) * 100 : 0, 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-2.5 rounded-full ${
                  remainingBudget >= 0 ? 'bg-success-500' : 'bg-danger-500'
                }`}
              />
            </div>
          </div>
          
          <ExpenseChart type="bar" />
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          
          <div className="grid grid-cols-3 gap-3">
            <Link to="/add" className="card flex flex-col items-center justify-center py-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full mb-2">
                <Plus size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-xs text-center">Add Expense</span>
            </Link>
            
            <Link to="/budget" className="card flex flex-col items-center justify-center py-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mb-2">
                <DollarSign size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs text-center">Add Income</span>
            </Link>
            
            <Link to="/settings" className="card flex flex-col items-center justify-center py-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full mb-2">
                <Calendar size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs text-center">Bill Reminder</span>
            </Link>
          </div>
        </motion.div>
        
        {/* Savings Tip */}
        {savingsTips.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="card bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800">
              <div className="flex items-start">
                <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-full mr-3">
                  <Lightbulb size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-primary-800 dark:text-primary-300 mb-1">Savings Tip</h3>
                  <p className="text-sm text-primary-700 dark:text-primary-400">
                    {savingsTips[activeTip]}
                  </p>
                </div>
              </div>
              
              {savingsTips.length > 1 && (
                <div className="flex justify-center mt-3">
                  {savingsTips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTip(index)}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        activeTip === index 
                          ? 'bg-primary-600 dark:bg-primary-400' 
                          : 'bg-primary-200 dark:bg-primary-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Recent Income */}
        {recentIncomes.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Recent Income</h2>
              <Link to="/budget" className="text-primary-600 dark:text-primary-400 text-sm flex items-center">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            {recentIncomes.map((income) => (
              <IncomeCard key={income.id} income={income} />
            ))}
          </motion.div>
        )}
        
        {/* Recent Expenses */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <Link to="/expenses" className="text-primary-600 dark:text-primary-400 text-sm flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <div className="card flex items-center justify-center py-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <AlertTriangle size={24} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No expenses yet</p>
                <Link to="/add" className="btn-primary mt-3 inline-flex items-center">
                  <Plus size={16} className="mr-1" />
                  Add Expense
                </Link>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Budgets */}
        {activeBudgets.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Active Budgets</h2>
              <Link to="/budget" className="text-primary-600 dark:text-primary-400 text-sm flex items-center">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            {activeBudgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </motion.div>
        )}
        
        {/* Upcoming Bills */}
        {upcomingBills.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Upcoming Bills</h2>
              <Link to="/settings" className="text-primary-600 dark:text-primary-400 text-sm flex items-center">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            {upcomingBills.map((bill) => (
              <BillReminderCard key={bill.id} reminder={bill} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;