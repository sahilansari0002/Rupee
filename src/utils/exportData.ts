import * as XLSX from 'xlsx';
import { Expense, Budget, SavingsGoal, BillReminder } from '../store/expenseStore';
import { getCategoryById, getPaymentMethodById } from './categories';
import { formatDate, formatCurrency } from './formatters';

// Function to export expenses to Excel
export const exportExpensesToExcel = (
  expenses: Expense[],
  budgets: Budget[],
  savingsGoals: SavingsGoal[],
  billReminders: BillReminder[]
) => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Format expenses data for export
  const expensesData = expenses.map(expense => ({
    'Date': formatDate(expense.date, false),
    'Description': expense.description,
    'Category': getCategoryById(expense.category).name,
    'Amount': expense.amount,
    'Payment Method': getPaymentMethodById(expense.paymentMethod).name,
    'Recurring': expense.isRecurring ? 'Yes' : 'No',
    'Tags': expense.tags ? expense.tags.join(', ') : ''
  }));
  
  // Format budgets data for export
  const budgetsData = budgets.map(budget => ({
    'Category': getCategoryById(budget.category).name,
    'Amount': budget.amount,
    'Period': budget.period.charAt(0).toUpperCase() + budget.period.slice(1),
    'Start Date': formatDate(budget.startDate, false),
    'End Date': budget.endDate ? formatDate(budget.endDate, false) : 'N/A',
    'Dynamic Adjustment': budget.isAutomaticAdjustment ? 'Yes' : 'No',
    'Adjustment %': budget.adjustmentPercentage || 'N/A'
  }));
  
  // Format savings goals data for export
  const savingsGoalsData = savingsGoals.map(goal => ({
    'Name': goal.name,
    'Target Amount': goal.targetAmount,
    'Current Amount': goal.currentAmount,
    'Progress': `${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%`,
    'Deadline': goal.deadline ? formatDate(goal.deadline, false) : 'N/A',
    'Category': goal.category ? getCategoryById(goal.category).name : 'N/A'
  }));
  
  // Format bill reminders data for export
  const billRemindersData = billReminders.map(reminder => ({
    'Name': reminder.name,
    'Amount': reminder.amount,
    'Due Date': formatDate(reminder.dueDate, false),
    'Category': getCategoryById(reminder.category).name,
    'Recurring': reminder.isRecurring ? 'Yes' : 'No',
    'Recurring Period': reminder.recurringPeriod ? 
      reminder.recurringPeriod.charAt(0).toUpperCase() + reminder.recurringPeriod.slice(1) : 'N/A',
    'Paid': reminder.isPaid ? 'Yes' : 'No'
  }));
  
  // Create worksheets
  const expensesWS = XLSX.utils.json_to_sheet(expensesData);
  const budgetsWS = XLSX.utils.json_to_sheet(budgetsData);
  const savingsGoalsWS = XLSX.utils.json_to_sheet(savingsGoalsData);
  const billRemindersWS = XLSX.utils.json_to_sheet(billRemindersData);
  
  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, expensesWS, "Expenses");
  XLSX.utils.book_append_sheet(wb, budgetsWS, "Budgets");
  XLSX.utils.book_append_sheet(wb, savingsGoalsWS, "Savings Goals");
  XLSX.utils.book_append_sheet(wb, billRemindersWS, "Bill Reminders");
  
  // Generate summary worksheet
  const summaryData = [
    { 'Summary': 'Total Expenses', 'Value': expenses.reduce((sum, expense) => sum + expense.amount, 0) },
    { 'Summary': 'Total Budget', 'Value': budgets.reduce((sum, budget) => sum + budget.amount, 0) },
    { 'Summary': 'Total Savings', 'Value': savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0) },
    { 'Summary': 'Upcoming Bills', 'Value': billReminders.filter(bill => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0) }
  ];
  
  const summaryWS = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");
  
  // Generate Excel file and trigger download
  const fileName = `RupeeTrack_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return fileName;
};