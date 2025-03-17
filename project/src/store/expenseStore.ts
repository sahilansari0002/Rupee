import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
  isRecurring: boolean;
  tags?: string[];
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  isAutomaticAdjustment?: boolean;
  adjustmentPercentage?: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category?: string;
}

export interface BillReminder {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
}

export interface ExpenseState {
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  billReminders: BillReminder[];
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';
  currency: '₹' | '$' | '€' | '£';
  userProfile: UserProfile;
  notifications: boolean;
  
  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Income actions
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  
  // Budget actions
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  adjustBudgetAutomatically: (budgetId: string) => void;
  
  // Savings goal actions
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  
  // Bill reminder actions
  addBillReminder: (reminder: Omit<BillReminder, 'id'>) => void;
  updateBillReminder: (id: string, reminder: Partial<BillReminder>) => void;
  deleteBillReminder: (id: string) => void;
  markBillAsPaid: (id: string) => void;
  
  // User profile actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toggleNotifications: () => void;
  
  // Settings
  setLanguage: (language: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr') => void;
  setCurrency: (currency: '₹' | '$' | '€' | '£') => void;
  
  // Analytics helpers
  getTotalExpensesByCategory: () => Record<string, number>;
  getTotalExpensesByMonth: () => Record<string, number>;
  getTotalExpensesForCurrentMonth: () => number;
  getTotalIncomeForCurrentMonth: () => number;
  getRemainingBudget: () => number;
  getBudgetStatus: (budgetId: string) => { used: number; remaining: number; percentage: number };
  getUpcomingBills: () => BillReminder[];
  getSavingsTips: () => string[];
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      incomes: [],
      budgets: [],
      savingsGoals: [],
      billReminders: [],
      language: 'en',
      currency: '₹',
      userProfile: {
        name: 'Guest User',
      },
      notifications: true,
      
      // Expense actions
      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
        
        // Check if any budgets need automatic adjustment
        const { budgets } = get();
        budgets.forEach(budget => {
          if (budget.isAutomaticAdjustment && budget.category === expense.category) {
            get().adjustBudgetAutomatically(budget.id);
          }
        });
      },
      
      updateExpense: (id, updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        }));
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      
      // Income actions
      addIncome: (income) => {
        const newIncome = {
          ...income,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          incomes: [newIncome, ...state.incomes],
        }));
      },
      
      updateIncome: (id, updatedIncome) => {
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updatedIncome } : income
          ),
        }));
      },
      
      deleteIncome: (id) => {
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        }));
      },
      
      // Budget actions
      addBudget: (budget) => {
        const newBudget = {
          ...budget,
          id: crypto.randomUUID(),
          isAutomaticAdjustment: budget.isAutomaticAdjustment || false,
          adjustmentPercentage: budget.adjustmentPercentage || 10,
        };
        set((state) => ({
          budgets: [newBudget, ...state.budgets],
        }));
      },
      
      updateBudget: (id, updatedBudget) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id ? { ...budget, ...updatedBudget } : budget
          ),
        }));
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }));
      },
      
      // Dynamic budget adjustment
      adjustBudgetAutomatically: (budgetId) => {
        const { budgets, expenses } = get();
        const budget = budgets.find(b => b.id === budgetId);
        
        if (!budget || !budget.isAutomaticAdjustment) return;
        
        // Get budget status
        const { used, percentage } = get().getBudgetStatus(budgetId);
        
        // Adjust budget based on spending patterns
        let newAmount = budget.amount;
        
        if (percentage > 90) {
          // If we're using more than 90% of the budget, increase it
          newAmount = Math.ceil(used * (1 + (budget.adjustmentPercentage || 10) / 100));
        } else if (percentage < 50 && used > 0) {
          // If we're using less than 50% of the budget, decrease it slightly
          newAmount = Math.ceil(used * (1 + (budget.adjustmentPercentage || 10) / 200));
        }
        
        // Only update if there's a significant change (more than 5%)
        if (Math.abs(newAmount - budget.amount) / budget.amount > 0.05) {
          set((state) => ({
            budgets: state.budgets.map((b) =>
              b.id === budgetId ? { ...b, amount: newAmount } : b
            ),
          }));
        }
      },
      
      // Savings goal actions
      addSavingsGoal: (goal) => {
        const newGoal = {
          ...goal,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          savingsGoals: [newGoal, ...state.savingsGoals],
        }));
      },
      
      updateSavingsGoal: (id, updatedGoal) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.map((goal) =>
            goal.id === id ? { ...goal, ...updatedGoal } : goal
          ),
        }));
      },
      
      deleteSavingsGoal: (id) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id),
        }));
      },
      
      // Bill reminder actions
      addBillReminder: (reminder) => {
        const newReminder = {
          ...reminder,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          billReminders: [newReminder, ...state.billReminders],
        }));
      },
      
      updateBillReminder: (id, updatedReminder) => {
        set((state) => ({
          billReminders: state.billReminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
          ),
        }));
      },
      
      deleteBillReminder: (id) => {
        set((state) => ({
          billReminders: state.billReminders.filter((reminder) => reminder.id !== id),
        }));
      },
      
      markBillAsPaid: (id) => {
        const { billReminders } = get();
        const reminder = billReminders.find(r => r.id === id);
        
        if (!reminder) return;
        
        // Add the bill payment as an expense
        get().addExpense({
          amount: reminder.amount,
          category: reminder.category,
          description: `Paid: ${reminder.name}`,
          date: format(new Date(), 'yyyy-MM-dd'),
          paymentMethod: 'upi', // Default payment method
          isRecurring: reminder.isRecurring,
          tags: ['bill-payment']
        });
        
        // Mark the bill as paid
        set((state) => ({
          billReminders: state.billReminders.map((r) =>
            r.id === id ? { ...r, isPaid: true } : r
          ),
        }));
      },
      
      // User profile actions
      updateUserProfile: (profile) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        }));
      },
      
      toggleNotifications: () => {
        set((state) => ({
          notifications: !state.notifications,
        }));
      },
      
      // Settings
      setLanguage: (language) => {
        set({ language });
      },
      
      setCurrency: (currency) => {
        set({ currency });
      },
      
      // Analytics helpers
      getTotalExpensesByCategory: () => {
        const { expenses } = get();
        return expenses.reduce((acc, expense) => {
          const { category, amount } = expense;
          acc[category] = (acc[category] || 0) + amount;
          return acc;
        }, {} as Record<string, number>);
      },
      
      getTotalExpensesByMonth: () => {
        const { expenses } = get();
        return expenses.reduce((acc, expense) => {
          const month = expense.date.substring(0, 7); // YYYY-MM format
          acc[month] = (acc[month] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);
      },
      
      getTotalExpensesForCurrentMonth: () => {
        const { expenses } = get();
        const currentMonth = format(new Date(), 'yyyy-MM');
        return expenses
          .filter((expense) => expense.date.startsWith(currentMonth))
          .reduce((total, expense) => total + expense.amount, 0);
      },
      
      getTotalIncomeForCurrentMonth: () => {
        const { incomes } = get();
        const currentMonth = format(new Date(), 'yyyy-MM');
        return incomes
          .filter((income) => income.date.startsWith(currentMonth))
          .reduce((total, income) => total + income.amount, 0);
      },
      
      getRemainingBudget: () => {
        const totalIncome = get().getTotalIncomeForCurrentMonth();
        const totalExpenses = get().getTotalExpensesForCurrentMonth();
        return totalIncome - totalExpenses;
      },
      
      getBudgetStatus: (budgetId) => {
        const { budgets, expenses } = get();
        const budget = budgets.find((b) => b.id === budgetId);
        
        if (!budget) {
          return { used: 0, remaining: 0, percentage: 0 };
        }
        
        // Filter expenses by category and date range
        const relevantExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          const startDate = new Date(budget.startDate);
          const endDate = budget.endDate ? new Date(budget.endDate) : new Date();
          
          return (
            expense.category === budget.category &&
            expenseDate >= startDate &&
            expenseDate <= endDate
          );
        });
        
        const used = relevantExpenses.reduce((total, expense) => total + expense.amount, 0);
        const remaining = Math.max(0, budget.amount - used);
        const percentage = (used / budget.amount) * 100;
        
        return { used, remaining, percentage };
      },
      
      getUpcomingBills: () => {
        const { billReminders } = get();
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        return billReminders
          .filter((reminder) => {
            if (reminder.isPaid) return false;
            
            const dueDate = new Date(reminder.dueDate);
            return dueDate >= today && dueDate <= thirtyDaysLater;
          })
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      },
      
      getSavingsTips: () => {
        const { expenses, incomes } = get();
        const totalIncome = get().getTotalIncomeForCurrentMonth();
        const totalExpenses = get().getTotalExpensesForCurrentMonth();
        const savingRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
        
        const tips = [
          "Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
          "Set up automatic transfers to a savings account on payday.",
          "Consider investing in PPF or FD for tax savings under Section 80C.",
          "Use UPI for payments to track expenses easily and earn cashback rewards.",
          "Try meal prepping at home to reduce food delivery expenses.",
          "Consider using apps like Zomato Pro or Swiggy Super for discounts on food delivery.",
          "Use public transport or carpooling to save on daily commute costs.",
          "Consider monthly metro passes for regular travel.",
          "Look for free entertainment options like public parks or community events.",
          "Share OTT subscriptions with family members to reduce costs.",
          "Wait for seasonal sales to make big purchases.",
          "Use cashback apps and credit card rewards for shopping.",
          "Switch off appliances when not in use to save on electricity bills.",
          "Consider installing energy-efficient LED bulbs.",
        ];
        
        // Add personalized tips based on spending patterns
        if (savingRate < 10) {
          tips.unshift("Your current saving rate is below 10%. Try to increase it to at least 20% for financial security.");
        } else if (savingRate >= 20) {
          tips.unshift(`Great job! You're saving ${Math.round(savingRate)}% of your income. Consider investing these savings for long-term growth.`);
        }
        
        // Get top spending categories
        const categoryTotals = get().getTotalExpensesByCategory();
        const sortedCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([category]) => category);
        
        if (sortedCategories.length > 0) {
          tips.unshift(`Your highest spending category is ${sortedCategories[0]}. Consider setting a stricter budget for this category.`);
        }
        
        // Return random selection of tips (max 3)
        return tips.slice(0, 3);
      },
    }),
    {
      name: 'expense-store',
    }
  )
);