import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { 
  Moon, Sun, Bell, Globe, IndianRupee, DollarSign, 
  Euro, PoundSterling, Plus, Check, Calendar
} from 'lucide-react';

import Header from '../components/Header';
import BillReminderCard from '../components/BillReminderCard';
import { useExpenseStore } from '../store/expenseStore';
import { useThemeStore } from '../store/themeStore';
import { expenseCategories } from '../utils/categories';

const BillReminderSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  dueDate: Yup.date().required('Due date is required'),
  category: Yup.string().required('Category is required'),
  isRecurring: Yup.boolean(),
  recurringPeriod: Yup.string().when('isRecurring', {
    is: true,
    then: () => Yup.string().required('Recurring period is required'),
  }),
});

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { 
    billReminders, 
    addBillReminder, 
    language, 
    setLanguage, 
    currency, 
    setCurrency 
  } = useExpenseStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  
  const initialValues = {
    name: '',
    amount: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    isRecurring: false,
    recurringPeriod: 'monthly',
    isPaid: false,
  };
  
  const handleSubmit = (values: any, { resetForm }: any) => {
    addBillReminder({
      name: values.name,
      amount: Number(values.amount),
      dueDate: values.dueDate,
      category: values.category,
      isRecurring: values.isRecurring,
      recurringPeriod: values.isRecurring ? values.recurringPeriod : undefined,
      isPaid: false,
    });
    
    resetForm();
    setShowAddForm(false);
  };
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
  ];
  
  const currencies = [
    { code: '₹', name: 'Indian Rupee (₹)', icon: IndianRupee },
    { code: '$', name: 'US Dollar ($)', icon: DollarSign },
    { code: '€', name: 'Euro (€)', icon: Euro },
    { code: '£', name: 'British Pound (£)', icon: PoundSterling },
  ];
  
  return (
    <div className="pb-20">
      <Header title="Settings" showBack={true} />
      
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Moon size={20} className="mr-3 text-primary-600 dark:text-primary-400" />
              ) : (
                <Sun size={20} className="mr-3 text-primary-600 dark:text-primary-400" />
              )}
              <span>Dark Mode</span>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Language</h2>
          
          <div className="flex items-center mb-3">
            <Globe size={20} className="mr-3 text-primary-600 dark:text-primary-400" />
            <span>Select Language</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  language === lang.code
                    ? 'bg-primary-100 dark:bg-primary-900 border border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Currency</h2>
          
          <div className="space-y-2">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code as any)}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  currency === curr.code
                    ? 'bg-primary-100 dark:bg-primary-900 border border-primary-500'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  currency === curr.code
                    ? 'bg-primary-200 dark:bg-primary-800'
                    : 'bg-gray-200 dark:bg-gray-700'
                } mr-3`}>
                  <curr.icon size={16} className={
                    currency === curr.code
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300'
                  } />
                </div>
                <span>{curr.name}</span>
                
                {currency === curr.code && (
                  <Check size={16} className="ml-auto text-primary-600 dark:text-primary-400" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Bill Reminders</h2>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Reminder
            </button>
          </div>
          
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Add Bill Reminder</h3>
                
                <Formik
                  initialValues={initialValues}
                  validationSchema={BillReminderSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="label">
                          Bill Name
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          placeholder="e.g., Electricity Bill"
                          className="input"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger-500 text-xs mt-1"
                        />
                      </div>
                      
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
                        <label htmlFor="dueDate" className="label">
                          Due Date
                        </label>
                        <Field
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          className="input"
                        />
                        <ErrorMessage
                          name="dueDate"
                          component="div"
                          className="text-danger-500 text-xs mt-1"
                        />
                      </div>
                      
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
                      
                      <div className="flex items-center">
                        <Field
                          id="isRecurring"
                          name="isRecurring"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          This is a recurring bill
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
                          Save Reminder
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </motion.div>
          )}
          
          {billReminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                You haven't set any bill reminders yet
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Your First Reminder
              </button>
            </div>
          ) : (
            <div>
              {billReminders.map((reminder) => (
                <BillReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;