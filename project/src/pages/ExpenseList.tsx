import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Trash2 } from 'lucide-react';

import Header from '../components/Header';
import ExpenseCard from '../components/ExpenseCard';
import { useExpenseStore } from '../store/expenseStore';
import { expenseCategories } from '../utils/categories';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  
  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? expense.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Group expenses by date
  const groupedExpenses: Record<string, typeof expenses> = {};
  
  filteredExpenses.forEach((expense) => {
    const date = expense.date;
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  const handleExpensePress = (id: string) => {
    setSelectedExpense(id === selectedExpense ? null : id);
  };
  
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    setSelectedExpense(null);
  };
  
  return (
    <div className="pb-20">
      <Header title="Expenses" showBack={true} />
      
      <div className="px-4 py-4">
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <Filter size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === null
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              
              {expenseCategories.slice(0, 8).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <category.icon size={14} className="mr-1" />
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {filteredExpenses.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-10">
            <Search size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {searchTerm || selectedCategory
                ? 'No expenses match your filters'
                : 'No expenses yet'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="btn-secondary mt-4"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            {sortedDates.map((date) => (
              <div key={date} className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                
                {groupedExpenses[date].map((expense) => (
                  <div key={expense.id}>
                    <ExpenseCard
                      expense={expense}
                      onPress={() => handleExpensePress(expense.id)}
                    />
                    
                    {selectedExpense === expense.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex justify-end -mt-2 mb-3 px-2"
                      >
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="btn-danger flex items-center text-xs py-1"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;