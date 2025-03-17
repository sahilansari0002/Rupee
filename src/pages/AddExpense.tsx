import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Camera, Mic, Check } from 'lucide-react';

import Header from '../components/Header';
import VoiceInput from '../components/VoiceInput';
import { useExpenseStore } from '../store/expenseStore';
import { expenseCategories, paymentMethods } from '../utils/categories';

const ExpenseSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  date: Yup.date().required('Date is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  isRecurring: Yup.boolean(),
  tags: Yup.array().of(Yup.string()),
});

const AddExpense: React.FC = () => {
  const { addExpense } = useExpenseStore();
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const initialValues = {
    amount: '',
    description: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'upi',
    isRecurring: false,
    tags: [],
  };
  
  const handleSubmit = (values: any, { resetForm }: any) => {
    addExpense({
      amount: Number(values.amount),
      description: values.description,
      category: values.category,
      date: values.date,
      paymentMethod: values.paymentMethod,
      isRecurring: values.isRecurring,
      tags: tags,
    });
    
    resetForm();
    setTags([]);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleVoiceResult = (result: { amount?: number; description?: string; category?: string }) => {
    // This will be used to update the form with voice input results
    setShowVoiceInput(false);
  };
  
  return (
    <div className="pb-20">
      <Header title="Add Expense" showBack={true} />
      
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {showVoiceInput ? (
            <div className="py-8">
              <h2 className="text-lg font-semibold text-center mb-6">Voice Input</h2>
              <VoiceInput onResult={handleVoiceResult} />
              <button
                onClick={() => setShowVoiceInput(false)}
                className="btn-secondary w-full mt-8"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={ExpenseSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">New Expense</h2>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowVoiceInput(true)}
                        className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full"
                      >
                        <Mic size={20} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      
                      <button
                        type="button"
                        className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full"
                      >
                        <Camera size={20} className="text-primary-600 dark:text-primary-400" />
                      </button>
                    </div>
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
                    <label htmlFor="description" className="label">
                      Description
                    </label>
                    <Field
                      id="description"
                      name="description"
                      type="text"
                      placeholder="What did you spend on?"
                      className="input"
                    />
                    <ErrorMessage
                      name="description"
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
                  
                  <div>
                    <label htmlFor="paymentMethod" className="label">
                      Payment Method
                    </label>
                    <Field
                      as="select"
                      id="paymentMethod"
                      name="paymentMethod"
                      className="input"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="paymentMethod"
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
                      This is a recurring expense
                    </label>
                  </div>
                  
                  <div>
                    <label className="label">Tags</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags"
                        className="input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 btn-primary"
                      >
                        Add
                      </button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Check size={18} className="mr-1" />
                    Save Expense
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddExpense;