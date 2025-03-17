import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Plus, Target, Check, Sliders, DollarSign, ArrowDown } from 'lucide-react';

import Header from '../components/Header';
import BudgetCard from '../components/BudgetCard';
import SavingsGoalCard from '../components/SavingsGoalCard';
import { useExpenseStore } from '../store/expenseStore';
import { expenseCategories } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';

const BudgetSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  period: Yup.string().required('Period is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date(),
  isAutomaticAdjustment: Yup.boolean(),
  adjustmentPercentage: Yup.number().when('isAutomaticAdjustment', {
    is: true,
    then: () => Yup.number().required('Adjustment percentage is required').min(1, 'Minimum 1%').max(50, 'Maximum 50%'),
  }),
});

const IncomeSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  source: Yup.string().required('Source is required'),
  description: Yup.string(),
  date: Yup.date().required('Date is required'),
  isRecurring: Yup.boolean(),
  recurringPeriod: Yup.string().when('isRecurring', {
    is: true,
    then: () => Yup.string().required('Recurring period is required'),
  }),
});

const SavingsGoalSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  targetAmount: Yup.number()
    .required('Target amount is required')
    .positive('Target amount must be positive'),
  currentAmount: Yup.number()
    .required('Current amount is required')
    .min(0, 'Current amount cannot be negative'),
  deadline: Yup.date(),
  category: Yup.string(),
});

const Budget: React.FC = () => {
  const { 
    budgets, 
    addBudget, 
    deleteBudget, 
    adjustBudgetAutomatically,
    incomes,
    addIncome,
    deleteIncome,
    savingsGoals,
    addSavingsGoal,
    deleteSavingsGoal,
    getTotalIncomeForCurrentMonth,
    getTotalExpensesForCurrentMonth,
    getRemainingBudget,
    getSavingsTips
  } = useExpenseStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  
  const totalIncome = getTotalIncomeForCurrentMonth();
  const totalExpenses = getTotalExpensesForCurrentMonth();
  const remainingBudget = getRemainingBudget();
  const savingsTips = getSavingsTips();
  
  const initialValues = {
    category: '',
    amount: '',
    period: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    isAutomaticAdjustment: false,
    adjustmentPercentage: 10,
  };
  
  const initialIncomeValues = {
    amount: '',
    source: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    isRecurring: false,
    recurringPeriod: 'monthly',
  };
  
  const initialGoalValues = {
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: '',
  };
  
  const handleSubmit = (values: any, { resetForm }: any) => {
    addBudget({
      category: values.category,
      amount: Number(values.amount),
      period: values.period,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      isAutomaticAdjustment: values.isAutomaticAdjustment,
      adjustmentPercentage: values.isAutomaticAdjustment ? Number(values.adjustmentPercentage) : undefined,
    });
    
    resetForm();
    setShowAddForm(false);
  };
  
  const handleIncomeSubmit = (values: any, { resetForm }: any) => {
    addIncome({
      amount: Number(values.amount),
      source: values.source,
      description: values.description,
      date: values.date,
      isRecurring: values.isRecurring,
      recurringPeriod: values.isRecurring ? values.recurringPeriod : undefined,
    });
    
    resetForm();
    setShowAddIncomeForm(false);
  };
  
  const handleGoalSubmit = (values: any, { resetForm }: any) => {
    addSavingsGoal({
      name: values.name,
      targetAmount: Number(values.targetAmount),
      currentAmount: Number(values.currentAmount),
      deadline: values.deadline || undefined,
      category: values.category || undefined,
    });
    
    resetForm();
    setShowAddGoalForm(false);
  };
  
  return (
    <div className="pb-20">
      <Header title="Budgets" showBack={true} />
      
      <div className="px-4 py-4">
        {/* Income Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Income Overview</h2>
            
            <button
              onClick={() => setShowAddIncomeForm(!showAddIncomeForm)}
              className="btn-success flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Income
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-lg font-semibold text-success-600 dark:text-success-500">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
              <p className={`text-lg font-semibold ${
                remainingBudget >= 0 
                  ? 'text-success-600 dark:text-success-500' 
                  : 'text-danger-600 dark:text-danger-500'
              }`}>
                {formatCurrency(remainingBudget)}
              </p>
            </div>
          </div>
          
          {/* Savings Tips */}
          {savingsTips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <Sliders size={14} className="mr-1" />
                Savings Tips
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
                {savingsTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Income List */}
          {incomes.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Recent Income</h3>
              {incomes.slice(0, 3).map((income) => (
                <div key={income.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{income.source}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {income.description || 'No description'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success-600 dark:text-success-500">
                        {formatCurrency(income.amount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(income.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No income recorded yet
            </div>
          )}
          
          {/* Add Income Form */}
          {showAddIncomeForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-hidden"
            >
              <h3 className="text-lg font-medium mb-4">Add New Income</h3>
              
              <Formik
                initialValues={initialIncomeValues}
                validationSchema={IncomeSchema}
                onSubmit={handleIncomeSubmit}
              >
                {({ values }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="amount" className="label">
                        Amount (₹)
                      </label>
                      <Field
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0"
                        className="input"
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="text-danger-500 text-xs mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="source" className="label">
                        Source
                      </label>
                      <Field
                        id="source"
                        name="source"
                        type="text"
                        placeholder="e.g., Salary, Freelance"
                        className="input"
                      />
                      <ErrorMessage
                        name="source"
                        component="div"
                        className="text-danger-500 text-xs mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="label">
                        Description (Optional)
                      </label>
                      <Field
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Additional details"
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="label">
                        Date
                      </label>
                      <Field
                        id="date"
                        name="date"
                        type="date"
                        className="input"
                      />
                      <ErrorMessage
                        name="date"
                        component="div"
                        className="text-danger-500 text-xs mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <Field
                        id="isRecurring"
                        name="isRecurring"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        This is recurring income
                      </label>
                    </div>
                    
                    {values.isRecurring && (
                      <div>
                        <label htmlFor="recurringPeriod" className="label">
                          Recurring Period
                        </label>
                        <Field
                          as="select"
                          id="recurringPeriod"
                          name="recurringPeriod"
                          className="input"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </Field>
                        <ErrorMessage
                          name="recurringPeriod"
                          component="div"
                          className="text-danger-500 text-xs mt-1"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddIncomeForm(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-success flex-1 flex items-center justify-center"
                      >
                        <Check size={18} className="mr-1" />
                        Save Income
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
        </motion.div>
        
        {/* Budgets Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Budgets</h2>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Budget
          </button>
        </div>
        
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-6 overflow-hidden"
          >
            <h3 className="text-lg font-medium mb-4">Create New Budget</h3>
            
            <Formik
              initialValues={initialValues}
              validationSchema={BudgetSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="category" className="label">
                      Category
                    </label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className="input"
                    >
                      <option value="">Select a category</option>
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="label">
                      Budget Amount (₹)
                    </label>
                    <Field
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="0"
                      className="input"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="period" className="label">
                      Budget Period
                    </label>
                    <Field
                      as="select"
                      id="period"
                      name="period"
                      className="input"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </Field>
                    <ErrorMessage
                      name="period"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="label">
                      Start Date
                    </label>
                    <Field
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="input"
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="label">
                      End Date (Optional)
                    </label>
                    <Field
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="input"
                    />
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Field
                      id="isAutomaticAdjustment"
                      name="isAutomaticAdjustment"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAutomaticAdjustment" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable dynamic budget adjustment
                    </label>
                  </div>
                  
                  {values.isAutomaticAdjustment && (
                    <div>
                      <label htmlFor="adjustmentPercentage" className="label">
                        Adjustment Percentage (%)
                      </label>
                      <Field
                        id="adjustmentPercentage"
                        name="adjustmentPercentage"
                        type="number"
                        min="1"
                        max="50"
                        className="input"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Budget will automatically adjust up or down based on your spending patterns
                      </p>
                      <ErrorMessage
                        name="adjustmentPercentage"
                        component="div"
                        className="text-danger-500 text-xs mt-1"
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      <Check size={18} className="mr-1" />
                      Save Budget
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
        
        {budgets.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-10">
            <Target size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              You haven't set any budgets yet
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="mb-6">
            {budgets.map((budget) => (
              <div key={budget.id}>
                <BudgetCard budget={budget} />
                {budget.isAutomaticAdjustment && (
                  <div className="flex items-center justify-end -mt-2 mb-3 px-2">
                    <div className="text-xs text-primary-600 dark:text-primary-400 flex items-center">
                      <Sliders size={12} className="mr-1" />
                      Dynamic budget adjustment enabled
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Savings Goals Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Savings Goals</h2>
          
          <button
            onClick={() => setShowAddGoalForm(!showAddGoalForm)}
            className="btn-primary flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Goal
          </button>
        </div>
        
        {showAddGoalForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-6 overflow-hidden"
          >
            <h3 className="text-lg font-medium mb-4">Create Savings Goal</h3>
            
            <Formik
              initialValues={initialGoalValues}
              validationSchema={SavingsGoalSchema}
              onSubmit={handleGoalSubmit}
            >
              {({ values }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="label">
                      Goal Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g., New Laptop, Emergency Fund"
                      className="input"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="targetAmount" className="label">
                      Target Amount (₹)
                    </label>
                    <Field
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      placeholder="0"
                      className="input"
                    />
                    <ErrorMessage
                      name="targetAmount"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="currentAmount" className="label">
                      Current Savings (₹)
                    </label>
                    <Field
                      id="currentAmount"
                      name="currentAmount"
                      type="number"
                      placeholder="0"
                      className="input"
                    />
                    <ErrorMessage
                      name="currentAmount"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deadline" className="label">
                      Target Date (Optional)
                    </label>
                    <Field
                      id="deadline"
                      name="deadline"
                      type="date"
                      className="input"
                    />
                    <ErrorMessage
                      name="deadline"
                      component="div"
                      className="text-danger-500 text-xs mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="label">
                      Category (Optional)
                    </label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className="input"
                    >
                      <option value="">Select a category</option>
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddGoalForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      <Check size={18} className="mr-1" />
                      Save Goal
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
        
        {savingsGoals.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-10">
            <Target size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              You haven't set any savings goals yet
            </p>
            <button
              onClick={() => setShowAddGoalForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div>
            {savingsGoals.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;